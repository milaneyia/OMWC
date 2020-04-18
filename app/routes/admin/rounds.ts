import Router from '@koa/router';
import { convertToInt, convertToIntOrThrow } from '../../helpers';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Round } from '../../models/rounds/Round';

const roundsAdminRouter = new Router();

roundsAdminRouter.prefix('/api/admin/rounds/');
roundsAdminRouter.use(authenticate);
roundsAdminRouter.use(isStaff);

roundsAdminRouter.get('/', async (ctx) => {
    const rounds = await Round.find({ relations: ['matches'] });

    ctx.body = {
        rounds,
    };
});

roundsAdminRouter.post('/save', async (ctx) => {
    const roundId = convertToInt(ctx.request.body.roundId);
    let round = await Round.findOne({ id: roundId });

    if (!round) {
        round = new Round();
    }

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

    round.title = ctx.request.body.title.trim();
    round.submissionsStartedAt = ctx.request.body.submissionsStartedAt;
    round.submissionsEndedAt = ctx.request.body.submissionsEndedAt;
    round.judgingStartedAt = ctx.request.body.judgingStartedAt;
    round.judgingEndedAt = ctx.request.body.judgingEndedAt;
    round.resultsAt = ctx.request.body.resultsAt;
    await round.save();

    // TODO: create matches automatically ?
    // round.information = ctx.request.body.information.trim() || null;
    // round.anonymisedLink = ctx.request.body.anonymisedLink.trim() || null;

    return ctx.redirect('/admin/rounds/');
});

export default roundsAdminRouter;
