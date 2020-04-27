import Koa from 'koa';
import bodyparser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import session from 'koa-session';
import serve from 'koa-static';
import views from 'koa-views';
import path from 'path';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import config from '../config.json';
import indexRouter from './routes';
import captainChoiceAdminRouter from './routes/admin/captainChoice';
import judgingAdminRouter from './routes/admin/judging';
import submissionsAdminRouter from './routes/admin/manageSubmissions';
import roundsAdminRouter from './routes/admin/rounds';
import scheduleAdminRouter from './routes/admin/schedule';
import teamsChoiceAdminRouter from './routes/admin/teamsChoice';
import captainApplicationsRouter from './routes/applications/captains';
import mapperApplicationsRouter from './routes/applications/mappers';
import captainVotingRouter from './routes/applications/voting';
import judgingRouter from './routes/judging';
import judgingResultsRouter from './routes/judgingResults';
import leaderboardRouter from './routes/results';
import mappersChoiceRouter from './routes/applications/mappersChoice';
import submissionsRouter from './routes/submissions';
import teamsRouter from './routes/teams';
import usersAdminRouter from './routes/admin/users';
import usersRouter from './routes/users';

const app = new Koa();
app.keys = config.keys;

// DB initialization
createConnection().then(() => {
    console.log('DB initializated');
}).catch((err) => {
    console.log(err);
});

// Middlewares
app.use(helmet());
app.use(session({ key: 'omwc:sess' }, app));
app.use(serve(path.join(__dirname, '../public')));
app.use(bodyparser());
app.use(views(path.join(__dirname, '../public')));

// Error handler
app.use(async (ctx, next) => {
    try {
        if (ctx.originalUrl !== '/favicon.ico') {
            console.log('\x1b[33m%s\x1b[0m', ctx.originalUrl);
        }

        await next();

        if (ctx.status === 404) {
            await ctx.render('index');
        }
    } catch (err) {
        ctx.status = err.status || 500;

        if (ctx.request.type === 'application/json') {
            ctx.body = { error: 'Something went wrong!' };
        } else {
            await ctx.render('error');
        }

        ctx.app.emit('error', err, ctx);
    }
});

// Public routes
app.use(indexRouter.routes());
app.use(indexRouter.allowedMethods());
app.use(leaderboardRouter.routes());
app.use(leaderboardRouter.allowedMethods());
app.use(judgingResultsRouter.routes());
app.use(judgingResultsRouter.allowedMethods());
app.use(teamsRouter.routes());
app.use(teamsRouter.allowedMethods());

// Applications & Choices routes
app.use(usersRouter.routes());
app.use(usersRouter.allowedMethods());
app.use(captainApplicationsRouter.routes());
app.use(captainApplicationsRouter.allowedMethods());
app.use(mapperApplicationsRouter.routes());
app.use(mapperApplicationsRouter.allowedMethods());
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
app.use(usersAdminRouter.routes());
app.use(usersAdminRouter.allowedMethods());
app.use(scheduleAdminRouter.routes());
app.use(scheduleAdminRouter.allowedMethods());
app.use(captainChoiceAdminRouter.routes());
app.use(captainChoiceAdminRouter.allowedMethods());
app.use(teamsChoiceAdminRouter.routes());
app.use(teamsChoiceAdminRouter.allowedMethods());

// Admin Routes - after start
app.use(roundsAdminRouter.routes());
app.use(roundsAdminRouter.allowedMethods());
app.use(submissionsAdminRouter.routes());
app.use(submissionsAdminRouter.allowedMethods());
app.use(judgingAdminRouter.routes());
app.use(judgingAdminRouter.allowedMethods());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.on('error', (err, ctx) => {
    console.log(err);
});

app.listen(3000);
