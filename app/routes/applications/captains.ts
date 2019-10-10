import Router from '@koa/router';
import { authenticate } from '../../middlewares/authentication';
import { CaptainApplication } from '../../models/applications/CaptainApplication';

const captainApplicationsRouter = new Router();

captainApplicationsRouter.prefix('/applications/captains');
captainApplicationsRouter.use(authenticate);

captainApplicationsRouter.get('/edit', async (ctx) => {
    const app = await CaptainApplication.findUserApplication(ctx.state.user);

    return ctx.render('applications/captains', {
        app,
        user: ctx.state.user,
    });
});

captainApplicationsRouter.post('/store', async (ctx) => {
    let app = await CaptainApplication.findUserApplication(ctx.state.user);

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
