import Router from '@koa/router';
import { convertToIntOrThrow } from '../../helpers';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Round } from '../../models/rounds/Round';
import { Match } from '../../models/rounds/Match';
import { Country } from '../../models/Country';

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

roundsAdminRouter.post('/save', async (ctx) => {
    if (!ctx.request.body.title ||
        !ctx.request.body.submissionsStartedAt ||
        !ctx.request.body.submissionsEndedAt ||
        !ctx.request.body.judgingStartedAt ||
        !ctx.request.body.judgingEndedAt ||
        !ctx.request.body.resultsAt
    ) {

        return ctx.body = {
            error: 'Not valid inputs',
        };
    }

    const roundId = convertToIntOrThrow(ctx.request.body.roundId);
    const round = await Round.findOneOrFail({ id: roundId });

    round.title = ctx.request.body.title.trim();
    round.submissionsStartedAt = ctx.request.body.submissionsStartedAt;
    round.submissionsEndedAt = ctx.request.body.submissionsEndedAt;
    round.judgingStartedAt = ctx.request.body.judgingStartedAt;
    round.judgingEndedAt = ctx.request.body.judgingEndedAt;
    round.resultsAt = ctx.request.body.resultsAt;
    round.isQualifier = ctx.request.body.isQualifier;
    await round.save();

    ctx.body = {
        round,
    };
});

roundsAdminRouter.get('/:id/matches', async (ctx) => {
    const [matches, competingTeams] = await Promise.all([
        Match.findByRoundWithSubmissions(ctx.params.id),
        Country.find({ wasConfirmed: true }),
    ]);

    ctx.body = {
        matches,
        competingTeams,
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

export default roundsAdminRouter;
