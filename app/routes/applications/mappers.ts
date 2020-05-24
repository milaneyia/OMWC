import Router from '@koa/router';
import { authenticate } from '../../middlewares/authentication';
import { onGoingApplications } from '../../middlewares/scheduleCheck';
import { MapperApplication } from '../../models/applications/MapperApplication';
import { Log, LOG_TYPE } from '../../models/Log';

const mapperApplicationsRouter = new Router();

mapperApplicationsRouter.prefix('/api/applications/mappers');
mapperApplicationsRouter.use(authenticate);
mapperApplicationsRouter.use(onGoingApplications);

mapperApplicationsRouter.post('/store', async (ctx) => {
    let app = await MapperApplication.findUserApplication(ctx.state.user.id);

    if (app) {
        return ctx.body = {
            error: 'Already applied.',
        };
    }

    app = new MapperApplication();
    app.user = ctx.state.user;
    await app.save();

    if (app) {
        return ctx.body = app;
    }

    ctx.body = {
        error: `Couldn't create the application`,
    };

    await Log.createAndSave(`${ctx.state.user.username} applied for mapper`, LOG_TYPE.User, ctx.state.user.id);
});

export default mapperApplicationsRouter;
