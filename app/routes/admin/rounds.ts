import Router from '@koa/router';
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
    const round = await Round.findOneOrFail({ where: { id: ctx.params.id } });

    return ctx.render('admin/rounds/manage', {
        round,
    });
});

roundsAdminRouter.post('/save', async (ctx) => {
    let round = await Round.findOne({ where: { id: ctx.request.body.roundId } });

    if (!round) {
        round = new Round();
    }

    if (!ctx.request.body.title.trim()) {
        return ctx.render('error');
    }

    round.title = ctx.request.body.title.trim();
    round.information = ctx.request.body.information.trim();
    round.submissionsStartedAt = ctx.request.body.submissionsStartedAt;
    round.submissionsEndedAt = ctx.request.body.submissionsEndedAt;
    round.judgingStartedAt = ctx.request.body.judgingStartedAt;
    round.judgingEndedAt = ctx.request.body.judgingEndedAt;
    await round.save();

    return ctx.redirect('/admin/rounds/');
});

export default roundsAdminRouter;
