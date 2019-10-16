import Router from '@koa/router';
import { authenticate } from '../../middlewares/authentication';
import { onGoingApplications } from '../../middlewares/scheduleCheck';
import { CaptainApplication } from '../../models/applications/CaptainApplication';

const captainApplicationsRouter = new Router();

captainApplicationsRouter.prefix('/applications/captains');
captainApplicationsRouter.use(authenticate);
captainApplicationsRouter.use(async (ctx, next) => {
    ctx.state.applicationType = 'captain';
    return await next();
});
captainApplicationsRouter.use(onGoingApplications);

captainApplicationsRouter.get('/edit', async (ctx) => {
    const app = await CaptainApplication.findUserApplication(ctx.state.user.id);

    return ctx.render('applications/captains', {
        app,
        user: ctx.state.user,
    });
});

captainApplicationsRouter.post('/save', async (ctx) => {
    let app = await CaptainApplication.findUserApplication(ctx.state.user.id);

    if (!app) {
        app = new CaptainApplication();
    }

    app.reason = ctx.request.body.reason.trim();
    app.user = ctx.state.user;
    await app.save();

    if (app) {
        return ctx.redirect('/');
    }

    return ctx.render('error');
});

export default captainApplicationsRouter;
