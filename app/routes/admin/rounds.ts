import Router from '@koa/router';
import { ParameterizedContext, Next } from 'koa';
import JSZip from 'jszip';
import path from 'path';
import fs from 'fs';
import { checkFileExistence, convertToIntOrThrow, calculateQualifierScores } from '../../helpers';
import { download } from '../../middlewares/downloadSubmission';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Round } from '../../models/rounds/Round';
import { Match } from '../../models/rounds/Match';
import { Country } from '../../models/Country';
import { Genre } from '../../models/rounds/Genre';
import { Ban } from '../../models/rounds/Ban';
import { Log, LOG_TYPE } from '../../models/Log';

const roundsAdminRouter = new Router();

roundsAdminRouter.prefix('/api/admin/rounds/');
roundsAdminRouter.use(authenticate);
roundsAdminRouter.use(isStaff);

roundsAdminRouter.get('/', async (ctx) => {
    const rounds = await Round.find({});

    ctx.body = {
        rounds,
    };
});

roundsAdminRouter.get('/:id', async (ctx) => {
    const round = await Round.findOneOrFail({
        where: { id: ctx.params.id },
        relations: ['matches'],
    });
    const competingTeams = Country.find({ wasConfirmed: true });

    ctx.body = {
        round,
        competingTeams,
    };
});

roundsAdminRouter.post('/store', async (ctx) => {
    const roundInput: Round = ctx.request.body.round;
    const round = new Round();

    if (!roundInput.title ||
        !roundInput.submissionsStartedAt ||
        !roundInput.submissionsEndedAt ||
        !roundInput.judgingStartedAt ||
        !roundInput.judgingEndedAt ||
        !roundInput.resultsAt
    ) {

        return ctx.body = {
            error: 'Not valid inputs',
        };
    }

    round.title = roundInput.title.trim();
    round.submissionsStartedAt = roundInput.submissionsStartedAt;
    round.submissionsEndedAt = roundInput.submissionsEndedAt;
    round.judgingStartedAt = roundInput.judgingStartedAt;
    round.judgingEndedAt = roundInput.judgingEndedAt;
    round.resultsAt = roundInput.resultsAt;
    round.isQualifier = roundInput.isQualifier;
    await round.save();

    if (round.isQualifier) {
        const newMatch = new Match();
        newMatch.round = round;
        newMatch.information = 'All vs All';
        await newMatch.save();
    }

    ctx.body = {
        round,
    };
});

roundsAdminRouter.post('/:id/save', async (ctx) => {
    const roundInput: Round = ctx.request.body.round;

    if (!roundInput.title ||
        !roundInput.submissionsStartedAt ||
        !roundInput.submissionsEndedAt ||
        !roundInput.judgingStartedAt ||
        !roundInput.judgingEndedAt ||
        !roundInput.resultsAt
    ) {
        return ctx.body = {
            error: 'Not valid inputs',
        };
    }

    const roundId = convertToIntOrThrow(ctx.params.id);
    const round = await Round.findOneOrFail({ id: roundId });

    round.title = roundInput.title.trim();
    round.submissionsStartedAt = roundInput.submissionsStartedAt;
    round.submissionsEndedAt = roundInput.submissionsEndedAt;
    round.judgingStartedAt = roundInput.judgingStartedAt;
    round.judgingEndedAt = roundInput.judgingEndedAt;
    round.resultsAt = roundInput.resultsAt;
    round.isQualifier = roundInput.isQualifier;
    await round.save();

    if (round.isQualifier) {
        let match = await Match.findOne({
            round,
        });

        if (!match) {
            match = new Match();
            match.round = round;
        }

        match.information = 'All vs All';
        await match.save();
    }

    ctx.body = {
        round,
    };
});

roundsAdminRouter.get('/:id/genres', async (ctx) => {
    const genres = await Genre.find({
        roundId: ctx.params.id,
    });

    ctx.body = {
        genres,
    };
});

async function validateGenreInput (ctx: ParameterizedContext, next: Next): Promise<any> {
    const name = ctx.request.body.name.trim();
    const downloadLink = ctx.request.body.downloadLink.trim();

    if (!name || !downloadLink) {
        return ctx.body = {
            error: 'Missing data',
        };
    }

    ctx.state.name = name;
    ctx.state.downloadLink = downloadLink;
    await next();
}

roundsAdminRouter.post('/:id/genres/store', validateGenreInput, async (ctx) => {
    const genre = new Genre();
    genre.name = ctx.state.name;
    genre.downloadLink = ctx.state.downloadLink;
    genre.roundId = ctx.params.id;
    await genre.save();

    const genres = await Genre.find({
        roundId: ctx.params.id,
    });

    ctx.body = {
        success: 'Created',
        genres,
    };
});

roundsAdminRouter.post('/:id/genres/:genreId/save', validateGenreInput, async (ctx) => {
    const genre = await Genre.findOneOrFail({ id: ctx.params.genreId });
    genre.name = ctx.state.name;
    genre.downloadLink = ctx.state.downloadLink;
    await genre.save();

    const genres = await Genre.find({
        roundId: ctx.params.id,
    });

    ctx.body = {
        success: 'Updated',
        genres,
    };
});

roundsAdminRouter.post('/:id/genres/:genreId/remove', async (ctx) => {
    const genre = await Genre.findOneOrFail({
        id: ctx.params.genreId,
    });
    await genre.remove();

    const genres = await Genre.find({
        roundId: ctx.params.id,
    });

    ctx.body = {
        success: 'Removed',
        genres,
    };
});

async function randomizeBans (team: Country, highSeedTeamId: number, genres: Genre[]): Promise<void> {
    let length = 1;
    if (team.id === highSeedTeamId) length = 2;

    let randomGenre = genres[Math.floor(Math.random() * genres.length)];

    for (let i = 0; i < length; i++) {
        const newBan = new Ban();
        newBan.place = i + 1;
        newBan.genreId = randomGenre.id;
        newBan.teamId = team.id;
        await newBan.save();

        if ((i + 1) < length) {
            let isNewRandom = false;

            while (!isNewRandom) {
                const newRandom = genres[Math.floor(Math.random() * genres.length)];

                if (newRandom.id !== randomGenre.id) {
                    isNewRandom = true;
                    randomGenre = newRandom;
                }
            }
        }
    }
}

roundsAdminRouter.post('/:id/randomizeBans', async (ctx) => {
    const [round, qualifier] = await Promise.all([
        Round.findOneOrFail({
            where: {
                id: ctx.params.id,
                isQualifier: false,
            },
            relations: [
                'genres',
                'matches',
                'matches.teamA',
                'matches.teamA.bans',
                'matches.teamA.bans.genre',
                'matches.teamB',
                'matches.teamB.bans',
                'matches.teamB.bans.genre',
            ],
        }),
        Round.findQualifierWithJudgingData(),
    ]);

    if (!round || !qualifier) {
        return ctx.body = {
            error: 'Not found',
        };
    }

    if (!round.genres.length) {
        return ctx.body = {
            error: 'Set the genres first...',
        };
    }

    const { teamsScores } = await calculateQualifierScores(qualifier);
    const randomizedCountries = [];

    for (const match of round.matches) {
        let highSeedTeamId = 0;

        if (!match.teamA || !match.teamB) continue;

        const teamA = match.teamA;
        const teamB = match.teamB;
        const teamABans = teamA.bans.filter(b => b.genre.roundId === round.id);
        const teamBBans = teamB.bans.filter(b => b.genre.roundId === round.id);

        const teamAQualifierPosition = teamsScores.findIndex(s => s.country.id === teamA.id);
        const teamBQualifierPosition = teamsScores.findIndex(s => s.country.id === teamB.id);
        highSeedTeamId = teamAQualifierPosition < teamBQualifierPosition ? teamA.id : teamB.id;

        if (!teamABans.length) {
            await randomizeBans(match.teamA, highSeedTeamId, round.genres);
            randomizedCountries.push(match.teamA.name);
        }

        if (!teamBBans.length) {
            await randomizeBans(match.teamB, highSeedTeamId, round.genres);
            randomizedCountries.push(match.teamB.name);
        }
    }

    ctx.body = {
        success: `Randomized bans for: ${randomizedCountries.join(', ')}`,
    };

    if (randomizedCountries.length) {
        await Log.createAndSave(`${ctx.state.user.username} randomized bans for: ${randomizedCountries.join(', ')}`, LOG_TYPE.Admin);
    }
});

roundsAdminRouter.get('/:id/matches', async (ctx) => {
    const [matches, competingTeams, { teamsScores }] = await Promise.all([
        Match.findByRoundWithSubmissions(ctx.params.id),
        Country.find({ wasConfirmed: true }),
        calculateQualifierScores(),
    ]);

    ctx.body = {
        matches,
        competingTeams,
        teamsScores,
    };
});

roundsAdminRouter.post('/:id/matches/store', async (ctx) => {
    const roundId = convertToIntOrThrow(ctx.params.id);
    const round = await Round.findOneOrFail({ id: roundId });
    const newMatch = ctx.request.body.match;

    const match = new Match();
    match.round = round;
    match.information = newMatch.information?.trim() || null;

    if (!round.isQualifier) {
        const [teamA, teamB] = await Promise.all([
            Country.findOne({ id: newMatch.teamAId }),
            Country.findOne({ id: newMatch.teamBId }),
        ]);

        if (!teamA || !teamB) {
            return ctx.body = {
                error: 'Missing a team',
            };
        }

        match.teamA = teamA;
        match.teamB = teamB;
    }

    await match.save();

    const matches = await Match.findByRoundWithSubmissions(round.id);

    ctx.body = {
        matches,
    };
});

roundsAdminRouter.post('/:id/matches/:matchId/save', async (ctx) => {
    const roundId = convertToIntOrThrow(ctx.params.id);
    const matchId = convertToIntOrThrow(ctx.params.matchId);
    const round = await Round.findOneOrFail({ id: roundId });
    const editingMatch = ctx.request.body.match;

    const match = await Match.findOneOrFail({
        where: { id: matchId },
        relations: ['teamA', 'teamB'],
    });

    match.information = editingMatch.information?.trim() || null;

    if (!round.isQualifier) {
        const [teamA, teamB] = await Promise.all([
            Country.findOne({ id: editingMatch.teamAId }),
            Country.findOne({ id: editingMatch.teamBId }),
        ]);

        if (!teamA || !teamB) {
            return ctx.body = {
                error: 'Missing a team',
            };
        }

        match.teamA = teamA;
        match.teamB = teamB;
    }

    await match.save();

    const matches = await Match.findByRoundWithSubmissions(round.id);

    ctx.body = {
        matches,
    };
});

roundsAdminRouter.post('/:id/matches/:matchId/remove', async (ctx) => {
    const roundId = convertToIntOrThrow(ctx.params.id);
    const matchId = convertToIntOrThrow(ctx.params.matchId);
    const match = await Match.findOneOrFail({ id: matchId });
    await match.remove();

    const matches = await Match.findByRoundWithSubmissions(roundId);

    ctx.body = {
        matches,
    };
});

roundsAdminRouter.post('/:id/generateZip', async (ctx) => {
    const type = ctx.request.body.type;
    let baseDir = '';

    if (type === 'anom') {
        baseDir = path.join(__dirname, '../../../osz/');
    } else {
        baseDir = path.join(__dirname, '../../../osz/originals/');
    }

    const roundId = convertToIntOrThrow(ctx.params.id);
    const round = await Round.findOneOrFail({
        where: {
            id: roundId,
        },
        relations: [
            'matches',
            'matches.teamA',
            'matches.teamB',
            'matches.submissions',
        ],
    });

    const zip = new JSZip();

    for (const match of round.matches) {
        let matchFolder = '';

        if (!round.isQualifier) {
            if (type === 'anom') {
                const anomNames = match.submissions.map(s => s.anonymisedAs);

                if (anomNames.length == 2) {
                    matchFolder = `${anomNames[0]} vs ${anomNames[1]}`;
                } else {
                    matchFolder = match.id.toString();
                }
            } else {
                matchFolder = `${match.teamA?.name} vs ${match.teamB?.name}`;
            }
        }

        for (const submission of match.submissions) {
            let submissionPath = '';
            let filename = '';

            if (type === 'anom') {
                if (!submission.anonymisedPath) continue;

                submissionPath = path.join(baseDir, submission.anonymisedPath);
                filename = path.basename(submission.anonymisedPath);
            } else {
                if (!submission.originalPath) continue;

                submissionPath = path.join(baseDir, submission.originalPath);
                filename = path.basename(submission.originalPath);
            }

            filename = path.join(matchFolder, filename);
            await checkFileExistence(submissionPath);
            zip.file(filename, fs.createReadStream(submissionPath));
        }
    }

    let finalDirPath = '';

    if (type === 'anom') {
        finalDirPath = path.join(__dirname, '../../../osz/zips/anoms');
    } else {
        finalDirPath = path.join(__dirname, '../../../osz/zips/originals');
    }

    await fs.promises.mkdir(finalDirPath, { recursive: true });
    const finalFilePath = path.join(finalDirPath, `${round.title}.zip`);
    const content = await zip.generateAsync({ type: 'nodebuffer' });
    await fs.promises.writeFile(finalFilePath, content);
    await checkFileExistence(finalFilePath);

    ctx.body = {
        success: 'Ok',
    };
});

roundsAdminRouter.get('/:id/downloadZip', async (ctx, next) => {
    const id = convertToIntOrThrow(ctx.params.id);
    const round = await Round.findOneOrFail({
        id,
    });

    ctx.state.baseDir = path.join(__dirname, '../../../osz/zips/originals');
    ctx.state.downloadPath = `${round.title}.zip`;

    return await next();
}, download);

roundsAdminRouter.get('/:id/downloadAnomZip', async (ctx, next) => {
    const id = convertToIntOrThrow(ctx.params.id);
    const round = await Round.findOneOrFail({
        id,
    });

    ctx.state.baseDir = path.join(__dirname, '../../../osz/zips/anoms');
    ctx.state.downloadPath = `${round.title}.zip`;

    return await next();
}, download);

export default roundsAdminRouter;
