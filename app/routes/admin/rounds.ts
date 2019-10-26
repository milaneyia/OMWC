import Router from '@koa/router';
import { convertToInt, convertToIntOrThrow } from '../../helpers';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Round } from '../../models/rounds/Round';

const roundsAdminRouter = new Router();

roundsAdminRouter.prefix('/admin/rounds/');
roundsAdminRouter.use(authenticate);
roundsAdminRouter.use(isStaff);

roundsAdminRouter.get('/', async (ctx) => {
    const rounds = await Round.find({});

    return ctx.render('admin/rounds/index', {
        rounds,
    });
});

roundsAdminRouter.get('/create', async (ctx) => {
    return ctx.render('admin/rounds/manage');
});

roundsAdminRouter.get('/edit/:id', async (ctx) => {
    const roundId = convertToIntOrThrow(ctx.params.id);
    const round = await Round.findOneOrFail({ id: roundId });

    return ctx.render('admin/rounds/manage', {
        round,
    });
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

        return ctx.render('error');
    }

    round.title = ctx.request.body.title.trim();
    round.information = ctx.request.body.information.trim() || null;
    round.anonymisedLink = ctx.request.body.anonymisedLink.trim() || null;
    round.submissionsStartedAt = ctx.request.body.submissionsStartedAt;
    round.submissionsEndedAt = ctx.request.body.submissionsEndedAt;
    round.judgingStartedAt = ctx.request.body.judgingStartedAt;
    round.judgingEndedAt = ctx.request.body.judgingEndedAt;
    round.resultsAt = ctx.request.body.resultsAt;
    await round.save();

    return ctx.redirect('/admin/rounds/');
});

export default roundsAdminRouter;
