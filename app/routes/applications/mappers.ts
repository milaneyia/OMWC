import Router from '@koa/router';
import { authenticate } from '../../middlewares/authentication';
import { canApplicate } from '../../middlewares/scheduleCheck';
import { MapperApplication } from '../../models/applications/MapperApplication';

const mapperApplicationsRouter = new Router();

mapperApplicationsRouter.prefix('/applications/mappers');
mapperApplicationsRouter.use(authenticate);
mapperApplicationsRouter.use(async (ctx, next) => {
    ctx.state.applicationType = 'mapper';
    return await next();
});
mapperApplicationsRouter.use(canApplicate);

mapperApplicationsRouter.get('/edit', async (ctx) => {
    const app = await MapperApplication.findUserApplication(ctx.state.user);

    if (app) {
        return ctx.redirect('back');
    }

    return ctx.render('applications/mappers', { user: ctx.state.user });
});

mapperApplicationsRouter.post('/store', async (ctx) => {
    let app = await MapperApplication.findUserApplication(ctx.state.user);

    if (app) {
        return ctx.render('error', {
            error: 'Already applied.',
        });
    }

    app = new MapperApplication();
    app.user = ctx.state.user;
    await app.save();

    if (app) {
        return ctx.redirect('/');
    }

    return ctx.render('error');
});

export default mapperApplicationsRouter;
