import Router from '@koa/router';
import koaBody from 'koa-body';
import path from 'path';
import { LessThanOrEqual, Brackets, In } from 'typeorm';
import { File } from 'formidable';
import { checkFileExistence, saveFile, convertToArray, calculateQualifierScores, getRandomInt } from '../helpers';
import { authenticate, isCaptain } from '../middlewares/authentication';
import { Round } from '../models/rounds/Round';
import { Submission } from '../models/rounds/Submission';
import { Match } from '../models/rounds/Match';
import { findSubmission, download } from '../middlewares/downloadSubmission';
import { Log, LOG_TYPE } from '../models/Log';
import { Ban } from '../models/rounds/Ban';
import { Genre } from '../models/rounds/Genre';
import { Roll } from '../models/rounds/Roll';

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

async function getBanningRound (userCountryId: number): Promise<{ nextRound: Round; currentMatch: Match } | undefined> {
    const today = new Date();
    const [previousRound, nextRound] = await Promise.all([
        Round.findOne({
            where: {
                resultsAt: LessThanOrEqual(today),
            },
            order: {
                resultsAt: 'DESC',
            },
        }),
        Round
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
            .addOrderBy('ban.place', 'ASC')
            .getOne(),
    ]);

    // TODO need a better way to do it...
    if (!previousRound || !nextRound || (previousRound.id + 1) !== nextRound.id || nextRound.id === 5) {
        return undefined;
    }

    const currentMatch = await Match.findRelatedCountryMatch(nextRound, userCountryId);

    if (!currentMatch) {
        return undefined;
    }

    return { nextRound, currentMatch };
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

interface RemainingGenreResponse {
    genreToMap: Genre;
    isHighSeed: boolean;
    teamsBans: Ban[];
}

interface ErrorResponse {
    error: string;
}

async function getRemainingGenre (currentRound: Round, teamId: number, highSeedTeamId: number, lowSeedTeamId: number): Promise<RemainingGenreResponse | ErrorResponse> {
    let remainingGenres = await Genre.find({
        round: currentRound,
    });

    const teamsBans = await Ban
        .createQueryBuilder('ban')
        .innerJoinAndSelect('ban.genre', 'genre')
        .innerJoinAndSelect('ban.team', 'team')
        .where('genre.roundId = :id', { id: currentRound.id })
        .andWhere(new Brackets(qb => {
            qb.where('ban.teamId = :teamAId', { teamAId: highSeedTeamId })
                .orWhere('ban.teamId = :teamBId', { teamBId: lowSeedTeamId });
        }))
        .orderBy('ban.teamId', 'ASC')
        .addOrderBy('ban.place', 'ASC')
        .getMany();

    const highSeedTeamBans = teamsBans.filter(b => b.teamId === highSeedTeamId);
    const lowSeedTeamBans = teamsBans.filter(b => b.teamId === lowSeedTeamId);

    if (!highSeedTeamBans.length || !lowSeedTeamBans.length) {
        return {
            error: 'Ask an admin to press THE button please, then refresh this page',
        };
    }

    remainingGenres = remainingGenres.filter(g => g.id !== lowSeedTeamBans[0].genreId);
    let highSeedTeamBan = highSeedTeamBans[0];

    if (highSeedTeamBans[0].genreId === lowSeedTeamBans[0].genreId) {
        highSeedTeamBan = highSeedTeamBans[1];
    }

    remainingGenres = remainingGenres.filter(g => g.id !== highSeedTeamBan.genreId);

    return {
        genreToMap: remainingGenres[0],
        isHighSeed: highSeedTeamId === teamId,
        teamsBans,
    };
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
    let teamsBans: Ban[] = [];
    let rolls: Roll[] = [];
    let rollValue: number | undefined;

    if (currentRound) {
        currentMatch = await Match.findRelatedCountryMatch(currentRound, teamId);

        // Qualifers and finals don't do bans
        if (!currentRound.isQualifier && currentRound.id !== 5 && currentMatch) {
            let highSeedTeamId: number;
            let lowSeedTeamId: number;

            // Used for ro16, but it's whatever now
            if (currentRound.id === 2) {
                const positions = await getQualifierPositions(currentMatch);
                highSeedTeamId = positions.highSeedTeamId;
                lowSeedTeamId = positions.lowSeedTeamId;
            } else {
                if (!currentMatch.teamAId || !currentMatch.teamBId) {
                    throw new Error('Missing match teams');
                }

                const [rollTeamA, rollTeamB] = await Promise.all([
                    Roll.findOne({
                        matchId: currentMatch.id,
                        teamId: currentMatch.teamAId,
                    }),
                    Roll.findOne({
                        matchId: currentMatch.id,
                        teamId: currentMatch.teamBId,
                    }),
                ]);

                if (!rollTeamA || !rollTeamB) {
                    return ctx.body = {
                        error: 'Ask an admin to press THE button please, then refresh this page',
                    };
                }

                highSeedTeamId = rollTeamA.value > rollTeamB.value ? currentMatch.teamAId : currentMatch.teamBId;
                lowSeedTeamId = rollTeamA.value < rollTeamB.value ? currentMatch.teamAId : currentMatch.teamBId;
            }

            const bansResult = await getRemainingGenre(currentRound, teamId, highSeedTeamId, lowSeedTeamId);
            if ('error' in bansResult) return ctx.body = bansResult;

            genreToMap = bansResult.genreToMap;
            isHighSeed = bansResult.isHighSeed;
            teamsBans = bansResult.teamsBans;
            rolls = await Roll.find({
                where: {
                    matchId: currentMatch.id,
                },
                relations: [
                    'team',
                ],
            });

            // TODO check if all matches have defined a genre, else wait for admin to press the button .. so all have the same time??
        }
    } else {
        const result = await getBanningRound(teamId);

        if (result) {
            nextRound = result.nextRound;
            currentMatch = result.currentMatch;

            // used on RO16
            if (nextRound.id === 2) {
                const { highSeedTeamId } = await getQualifierPositions(result.currentMatch);
                isHighSeed = highSeedTeamId === teamId;
            } else {
                const roll = await Roll.findOne({
                    matchId: currentMatch.id,
                    teamId,
                });

                rollValue = roll?.value;
                isHighSeed = true; // All teams ban 2 genres in others rounds, it's quick fix
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
        teamsBans,
        rolls,
        rollValue,
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

    const oszFile = ctx.request.files?.oszFile as File | undefined;

    if (!oszFile || !oszFile.name?.endsWith('.osz')) {
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
    const result = await getBanningRound(teamId);

    if (!result || !result.nextRound.genres.length) {
        return ctx.body = {
            error: 'Not in time',
        };
    }

    const alreadyBanned = result.nextRound.genres.some(g =>
        g.bans.some(b => b.teamId === teamId)
    );

    if (alreadyBanned) {
        return ctx.body = {
            error: 'Already banned',
        };
    }

    const bansInput = convertToArray<number>(ctx.request.body.bans);
    const bans = await Genre.find({
        where: {
            id: In(bansInput),
            roundId: result.nextRound.id,
        },
    });

    // used on RO16, useless now i guess ?
    if (result.nextRound.id === 2) {
        const { highSeedTeamId, lowSeedTeamId } = await getQualifierPositions(result.currentMatch);

        if (
            bans.length !== bansInput.length ||
            (highSeedTeamId === teamId && bans.length !== 2) ||
            (lowSeedTeamId === teamId && bans.length !== 1)
        ) {
            return ctx.body = {
                error: 'Wrong number of bans',
            };
        }
    } else {
        if (bans.length !== bansInput.length || bans.length !== 2) {
            return ctx.body = {
                error: 'Wrong number of bans',
            };
        }

        const currentMatch = await Match.findRelatedCountryMatch(result.nextRound, teamId);

        if (!currentMatch) {
            throw new Error('Not participating');
        }

        const otherTeamId = currentMatch.teamAId === teamId ? currentMatch.teamBId : currentMatch.teamAId;
        const otherTeamRoll = await Roll.findOne({
            teamId: otherTeamId,
            matchId: currentMatch.id,
        });
        let isNewRandom = false;
        let rollValue = getRandomInt();

        if (otherTeamRoll && otherTeamRoll.value === rollValue) {
            while (!isNewRandom) {
                rollValue = getRandomInt();

                if (otherTeamRoll.value !== rollValue) {
                    isNewRandom = true;
                }
            }
        }

        const roll = new Roll();
        roll.matchId = currentMatch.id;
        roll.teamId = teamId;
        roll.value = rollValue;
        await roll.save();
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
