import Router from '@koa/router';
import { authenticate } from '../../middlewares/authentication';
import { CaptainApplication } from '../../models/applications/CaptainApplication';

const applicationsRouter = new Router();

applicationsRouter.prefix('/applications/captains');
applicationsRouter.use(authenticate);

applicationsRouter.get('/me', async (ctx) => {
    const app = await CaptainApplication.findOne({ where: { user: ctx.state.user.id } });

    return ctx.body = {
        app,
        user: ctx.state.user,
    };
});

applicationsRouter.get('/edit', async (ctx) => {
    return ctx.render('applications/captains');
});

applicationsRouter.post('/store', async (ctx) => {
    let app = await CaptainApplication.findOne({ where: { user: ctx.state.user } });

    if (!app) {
        app = new CaptainApplication();
    }

    app.reason = ctx.request.body.reason;
    app.user = ctx.state.user;
    app.save();

    if (app) {
        return ctx.body = {
            success: 'ok',
        };
    }

    return ctx.body = {
        error: 'Something went wrong!',
    };
});

export default applicationsRouter;
