import Koa from 'koa';
import bodyparser from 'koa-bodyparser';
import session from 'koa-session';
import serve from 'koa-static';
import views from 'koa-views';
import path from 'path';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import config from '../config.json';
import indexRouter from './routes';
import captainChoiceAdminRouter from './routes/admin/captainChoice';
import scheduleAdminRouter from './routes/admin/schedule';
import captainApplicationsRouter from './routes/applications/captains';
import judgeApplicationsRouter from './routes/applications/judges';
import mapperApplicationsRouter from './routes/applications/mappers';
import captainVotingRouter from './routes/captainVoting';

const app = new Koa();
app.keys = config.keys;

// DB initialization
createConnection();

// Middlewares
app.use(session(app));
app.use(serve(path.join(__dirname, '../public')));
app.use(bodyparser());
app.use(views(path.join(__dirname, 'templates'), {
    extension: 'pug',
}));

// Error handler
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = 'Something went wrong!';
        ctx.app.emit('error', err, ctx);
    }
});

// Index route
app.use(indexRouter.routes());
app.use(indexRouter.allowedMethods());

// Applications routes
app.use(captainApplicationsRouter.routes());
app.use(captainApplicationsRouter.allowedMethods());
app.use(mapperApplicationsRouter.routes());
app.use(mapperApplicationsRouter.allowedMethods());
app.use(judgeApplicationsRouter.routes());
app.use(judgeApplicationsRouter.allowedMethods());
app.use(captainVotingRouter.routes());
app.use(captainVotingRouter.allowedMethods());

// Admin routes
app.use(scheduleAdminRouter.routes());
app.use(scheduleAdminRouter.allowedMethods());
app.use(captainChoiceAdminRouter.routes());
app.use(captainChoiceAdminRouter.allowedMethods());

app.on('error', (err, ctx) => {
    // tslint:disable-next-line
    console.log(err);
});

app.listen(3000);
