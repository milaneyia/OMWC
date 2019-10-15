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
import judgesChoiceAdminRouter from './routes/admin/judgesChoice';
import criteriasAdminRouter from './routes/admin/judging/criterias';
import judgingAdminRouter from './routes/admin/judging/index';
import submissionsAdminRouter from './routes/admin/manageSubmissions';
import roundsAdminRouter from './routes/admin/rounds';
import scheduleAdminRouter from './routes/admin/schedule';
import teamsChoiceAdminRouter from './routes/admin/teamsChoice';
import captainApplicationsRouter from './routes/applications/captains';
import judgeApplicationsRouter from './routes/applications/judges';
import mapperApplicationsRouter from './routes/applications/mappers';
import captainVotingRouter from './routes/captainVoting';
import judgingRouter from './routes/judging';
import mappersChoiceRouter from './routes/mappersChoice';
import submissionsRouter from './routes/submissions';

const app = new Koa();
app.keys = config.keys;

// DB initialization
createConnection().then(() => {
    // tslint:disable-next-line
    console.log('DB initializated');
})
.catch((err) => {
    // tslint:disable-next-line
    console.log(err);
});

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
        await ctx.render('error');
        ctx.app.emit('error', err, ctx);
    }
});

// Index route
app.use(indexRouter.routes());
app.use(indexRouter.allowedMethods());

// Applications & Choices routes
app.use(captainApplicationsRouter.routes());
app.use(captainApplicationsRouter.allowedMethods());
app.use(mapperApplicationsRouter.routes());
app.use(mapperApplicationsRouter.allowedMethods());
app.use(judgeApplicationsRouter.routes());
app.use(judgeApplicationsRouter.allowedMethods());
app.use(captainVotingRouter.routes());
app.use(captainVotingRouter.allowedMethods());
app.use(mappersChoiceRouter.routes());
app.use(mappersChoiceRouter.allowedMethods());

// .osz Submissions - captain
app.use(submissionsRouter.routes());
app.use(submissionsRouter.allowedMethods());

// Judges page
app.use(judgingRouter.routes());
app.use(judgingRouter.allowedMethods());

// Admin routes - pre start
app.use(scheduleAdminRouter.routes());
app.use(scheduleAdminRouter.allowedMethods());
app.use(captainChoiceAdminRouter.routes());
app.use(captainChoiceAdminRouter.allowedMethods());
app.use(teamsChoiceAdminRouter.routes());
app.use(teamsChoiceAdminRouter.allowedMethods());
app.use(judgesChoiceAdminRouter.routes());
app.use(judgesChoiceAdminRouter.allowedMethods());

// Admin Routes - after start
app.use(criteriasAdminRouter.routes());
app.use(criteriasAdminRouter.allowedMethods());
app.use(roundsAdminRouter.routes());
app.use(roundsAdminRouter.allowedMethods());
app.use(submissionsAdminRouter.routes());
app.use(submissionsAdminRouter.allowedMethods());
app.use(judgingAdminRouter.routes());
app.use(judgingAdminRouter.allowedMethods());

app.on('error', (err, ctx) => {
    // tslint:disable-next-line
    console.log(err);
});

app.listen(3000);
