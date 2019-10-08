import Router from '@koa/router';
import * as osuApi from '../middlewares/osuApi';
import { User } from '../models/User';

const indexRouter = new Router();

indexRouter.get('/', async (ctx) => {
    return await ctx.render('index');
});

indexRouter.get('/me', async (ctx) => {
    const user = await User.findOne({ where: { osuId: ctx.session.id } });

    return ctx.body = { user };
});

indexRouter.get('/login', async (ctx) => {
    const state = osuApi.generateState();
    ctx.cookies.set('_state', state);

    return ctx.redirect(osuApi.generateAuthorizeUrl(state));
});

indexRouter.get('/callback', async (ctx) => {
    if (!ctx.query.code || ctx.query.error) {
        return ctx.redirect('/');
    }

    const decodedState = osuApi.decodeState(ctx.query.state);
    const savedState = ctx.cookies.get('_state');
    ctx.cookies.set('_state', undefined);

    if (decodedState !== savedState) {
        return ctx.render('error');
    }

    let response = await osuApi.getToken(ctx.query.code);

    if (response.error) {
        ctx.render('error');
    } else {
        ctx.session.accessToken = response.access_token;
        ctx.session.refreshToken = response.refresh_token;

        response = await osuApi.getUserInfo(response.access_token);

        if (response.error) {
            return ctx.render('error');
        }

        ctx.session.id = response.id;
        ctx.session.username = response.username;

        if (!(await User.findOne(response.id))) {
            let newUser = await User.create({
                osuId: response.id,
                username: response.username,
            });
            newUser = await newUser.save();

            if (newUser) {
                return ctx.redirect('back');
            }
        }

        return ctx.render('error');
    }
});

export default indexRouter;
