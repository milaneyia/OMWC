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
import applicationsRouter from './routes/applications/captains';

const app = new Koa();
app.keys = config.keys;

createConnection();

app.use(session(app));
app.use(serve(path.join(__dirname, '../public')));
app.use(bodyparser());
app.use(views(path.join(__dirname, 'templates'), {
    extension: 'pug',
}));

app.use(indexRouter.routes());
app.use(indexRouter.allowedMethods());
app.use(applicationsRouter.routes());
app.use(applicationsRouter.allowedMethods());

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = err.message;
        ctx.app.emit('error', err, ctx);
    }
});

app.on('error', (err, ctx) => {
    // tslint:disable-next-line
    console.log(err);
});

app.listen(3000);
