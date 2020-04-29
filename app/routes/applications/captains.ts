import Router from '@koa/router';
import { authenticate, isElevatedUser } from '../../middlewares/authentication';
import { onGoingApplications } from '../../middlewares/scheduleCheck';
import { CaptainApplication } from '../../models/applications/CaptainApplication';

const captainApplicationsRouter = new Router();

captainApplicationsRouter.prefix('/api/applications/captains');
captainApplicationsRouter.use(authenticate);
captainApplicationsRouter.use(isElevatedUser);
captainApplicationsRouter.use(onGoingApplications);

captainApplicationsRouter.post('/save', async (ctx) => {
    let app = await CaptainApplication.findUserApplication(ctx.state.user.id);

    if (!app) {
        app = new CaptainApplication();
    }

    app.reason = ctx.request.body.reason.trim();
    app.user = ctx.state.user;
    await app.save();

    let body: object = {
        error: `Couldn't create the application`,
    };

    if (app) {
        body = {
            captainApplication: app,
            success: 'ok',
        };
    }

    ctx.body = body;
});

export default captainApplicationsRouter;
