import Router from '@koa/router';
import koaBody from 'koa-body';
import path from 'path';
import { LessThanOrEqual, Brackets, In } from 'typeorm';
import { checkFileExistence, saveFile, convertToArray, calculateQualifierScores } from '../helpers';
import { authenticate, isCaptain } from '../middlewares/authentication';
import { Round } from '../models/rounds/Round';
import { Submission } from '../models/rounds/Submission';
import { Match } from '../models/rounds/Match';
import { findSubmission, download } from '../middlewares/downloadSubmission';
import { Log, LOG_TYPE } from '../models/Log';
import { Ban } from '../models/rounds/Ban';
import { Genre } from '../models/rounds/Genre';

const baseDir = path.join(__dirname, '../../osz/originals/');
const submissionsRouter = new Router();

submissionsRouter.prefix('/api/submissions');
submissionsRouter.use(authenticate);
submissionsRouter.use(isCaptain);
submissionsRouter.use(async (ctx, next) => {
    if (ctx.state.user.country.wasConfirmed) {
        await next();
    } else {
        return ctx.body = {
            error: 'Your team is not competing',
        };
    }
});

async function getBanningRound (userCountryId: number): Promise<Round | undefined> {
    const today = new Date();
    const previousRound = await Round.findOne({
        where: {
            resultsAt: LessThanOrEqual(today),
        },
        order: {
            resultsAt: 'DESC',
        },
    });
    const nextRound = await Round
        .createQueryBuilder('round')
        .innerJoin('round.genres', 'genre')
        .leftJoin('genre.bans', 'ban', 'ban.teamId = :teamId', { teamId: userCountryId })
        .leftJoin('ban.genre', 'banGenre')
        .where('round.submissionsStartedAt >= :today', { today })
        .select([
            'round',
            'genre.id',
            'genre.name',
            'banGenre.id',
            'banGenre.name',
            'ban',
        ])
        .orderBy('round.submissionsStartedAt', 'ASC')
        .getOne();

    if (!previousRound || !nextRound) {
        return undefined;
    }

    const currentMatch = await Match.findRelatedCountryMatch(nextRound, userCountryId);

    if (!currentMatch) {
        return undefined;
    }

    return nextRound;
}

async function getQualifierPositions (match: Match): Promise<{ highSeedTeamId: number; lowSeedTeamId: number }> {
    const qualifier = await Round.findQualifierWithJudgingData(true);
    const { teamsScores } = await calculateQualifierScores(qualifier);
    let highSeedTeamId = 0;
    let lowSeedTeamId = 0;

    if (match.teamAId && match.teamBId) {
        const teamAQualifierPosition = teamsScores.findIndex(s => s.country.id === match.teamAId);
        const teamBQualifierPosition = teamsScores.findIndex(s => s.country.id === match.teamBId);
        highSeedTeamId = teamAQualifierPosition < teamBQualifierPosition ? match.teamAId : match.teamBId;
        lowSeedTeamId = teamAQualifierPosition > teamBQualifierPosition ? match.teamAId : match.teamBId;
    }

    return { highSeedTeamId, lowSeedTeamId };
}

submissionsRouter.get('/', async (ctx) => {
    const [submissions, currentRound] = await Promise.all([
        Submission.find({
            where: { country: ctx.state.user.country },
            relations: ['match', 'match.round'],
        }),
        Round.findCurrentSubmissionRound(),
    ]);
    const teamId = ctx.state.user.country.id;
    let currentMatch: Match | undefined;
    let nextRound: Round | undefined;
    let genreToMap: Genre | undefined;
    let isHighSeed = false;

    if (currentRound) {
        currentMatch = await Match.findRelatedCountryMatch(currentRound, teamId);

        if (!currentRound.isQualifier && currentMatch) {
            let remainingGenres = await Genre.find({
                round: currentRound,
            });
            const { highSeedTeamId, lowSeedTeamId } = await getQualifierPositions(currentMatch);

            const teamBans = await Ban
                .createQueryBuilder('ban')
                .innerJoinAndSelect('ban.genre', 'genre')
                .where('genre.roundId = :id', { id: currentRound.id })
                .andWhere(new Brackets(qb => {
                    qb.where('ban.teamId = :teamAId', { teamAId: highSeedTeamId })
                        .orWhere('ban.teamId = :teamBId', { teamBId: lowSeedTeamId });
                }))
                .orderBy('ban.teamId', 'ASC')
                .addOrderBy('ban.place', 'ASC')
                .getMany();

            const highSeedTeamBans = teamBans.filter(b => b.teamId === highSeedTeamId);
            const lowSeedTeamBans = teamBans.filter(b => b.teamId === lowSeedTeamId);

            if (!highSeedTeamBans.length || !lowSeedTeamBans.length) {
                return ctx.body = {
                    error: 'Ask an admin to press THE button please, then refresh this page',
                };
            }

            remainingGenres = remainingGenres.filter(g => g.id !== highSeedTeamBans[0].genreId);
            let lowSeedTeamBan = lowSeedTeamBans[0];

            if (highSeedTeamBans[0].genreId === lowSeedTeamBans[0].genreId) {
                lowSeedTeamBan = lowSeedTeamBans[1];
            }

            remainingGenres = remainingGenres.filter(g => g.id !== lowSeedTeamBan.genreId);
            genreToMap = remainingGenres[0];
            isHighSeed = highSeedTeamId === teamId;

            // TODO check if all matches have defined a genre, else wait for admin to press the button .. so all have the same time??
        }
    } else {
        nextRound = await getBanningRound(teamId);

        if (nextRound) {
            currentMatch = await Match.findRelatedCountryMatch(nextRound, teamId);

            if (currentMatch) {
                const { highSeedTeamId } = await getQualifierPositions(currentMatch);
                isHighSeed = highSeedTeamId === teamId;
            }
        }
    }

    ctx.body = {
        currentRound,
        currentMatch,
        submissions,
        nextRound,
        genreToMap,
        isHighSeed,
    };
});

submissionsRouter.post('/save', koaBody({
    multipart: true,
    formidable: {
        multiples: false,
    },
}), async (ctx) => {
    const currentRound = await Round.findCurrentSubmissionRound();

    if (!currentRound) {
        return ctx.body = {
            error: 'No round in progress',
        };
    }

    const oszFile = ctx.request.files?.oszFile;

    if (!oszFile || !oszFile.name.endsWith('.osz')) {
        return ctx.body = {
            error: 'Select an .osz file',
        };
    }

    const captainCountry = ctx.state.user.country;
    const match = await Match.findRelatedCountryMatch(currentRound, captainCountry.id);

    if (!match) {
        return ctx.body = {
            error: `Your team isn't competeting`,
        };
    }

    const finalDir = path.join(baseDir, ctx.state.user.country.code);
    const fileName = `${ctx.state.user.country.name} - ${currentRound.title}.osz`;
    const finalPath = path.join(finalDir, fileName);
    const originalPath = path.join(ctx.state.user.country.code, fileName);

    if (oszFile) {
        await saveFile(oszFile.path, finalDir, finalPath);
    }

    await checkFileExistence(finalPath);

    let submission = await Submission.findOne({
        country: captainCountry,
        match,
    });

    if (!submission) {
        submission = new Submission();
        submission.match = match;
        submission.country = ctx.state.user.country;
    }

    submission.originalPath = originalPath;
    await submission.save();

    ctx.body = {
        success: 'ok',
    };

    await Log.createAndSave(`${ctx.state.user.username} uploaded a submission for ${currentRound.title} under ${originalPath}`, LOG_TYPE.User, submission.id);
});

submissionsRouter.get('/:id/download', findSubmission, async (ctx, next) => {
    const submission: Submission = ctx.state.submission;

    if (submission.countryId !== ctx.state.user.country.id) {
        return ctx.body = {
            error: 'Unauthorized',
        };
    }

    ctx.state.baseDir = baseDir;
    ctx.state.downloadPath = submission.originalPath;

    return await next();
}, download);

submissionsRouter.post('/saveBans', async (ctx) => {
    const teamId = ctx.state.user.country.id;
    const currentBanRound = await getBanningRound(teamId);

    if (!currentBanRound || !currentBanRound.genres.length) {
        return ctx.body = {
            error: 'Not in time',
        };
    }

    const alreadyBanned = currentBanRound.genres.some(g =>
        g.bans.some(b => b.teamId === teamId)
    );

    if (alreadyBanned) {
        return ctx.body = {
            error: 'Already banned',
        };
    }

    const currentMatch = await Match.findRelatedCountryMatch(currentBanRound, teamId);

    if (!currentMatch) {
        return ctx.body = {
            error: 'Something went wrong!',
        };
    }

    const { highSeedTeamId, lowSeedTeamId } = await getQualifierPositions(currentMatch);
    const bansInput = convertToArray<number>(ctx.request.body.bans);
    const bans = await Genre.find({
        where: {
            id: In(bansInput),
            roundId: currentBanRound.id,
        },
    });

    if (
        bans.length !== bansInput.length ||
        (highSeedTeamId === teamId && bans.length !== 1) ||
        (lowSeedTeamId === teamId && bans.length !== 2)
    ) {
        return ctx.body = {
            error: 'Wrong number of bans',
        };
    }

    for (let i = 0; i < bansInput.length; i++) {
        const ban = bansInput[i];
        const newBan = new Ban();
        newBan.place = i + 1;
        newBan.genreId = ban;
        newBan.teamId = teamId;
        await newBan.save();
    }

    ctx.body = {
        success: 'Saved',
    };

    await Log.createAndSave(`${ctx.state.user.username} banned ${bans.map(b => b.name).join(', ')}`, LOG_TYPE.User);
});

export default submissionsRouter;
