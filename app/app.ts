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

const app = new Koa();
app.keys = config.keys;

createConnection();

app
    .use(session(app))
    .use(serve(path.join(__dirname, '../public')))
    .use(bodyparser())
    .use(views(path.join(__dirname, 'templates'), {
        map: {
            html: 'ejs',
        },
    }));

app
    .use(indexRouter.routes())
    .use(indexRouter.allowedMethods());

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
