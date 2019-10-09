import Router from '@koa/router';
import { authUser } from '../middlewares/authentication';
import * as osuApi from '../middlewares/osuApi';
import { Country } from '../models/Country';
import { Role } from '../models/Role';
import { User } from '../models/User';

const indexRouter = new Router();

indexRouter.get('/', authUser, async (ctx) => {
    return await ctx.render('index', { user: ctx.state.user });
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

        ctx.session.osuId = response.id;
        ctx.session.username = response.username;

        let country = await Country.findOne({ where: { name: response.country.name }});

        if (!country) {
            country = await Country.create({
                code: response.country.code,
                name: response.country.name,
            }).save();
        }

        const user = await User.findOne({ where: { osuId: response.id } });

        if (!user) {
            const userRole = await Role.findUserRole();

            if (userRole) {
                const newUser = await User.create({
                    country,
                    osuId: response.id,
                    roles: [userRole],
                    username: response.username,
                }).save();

                if (newUser) {
                    return ctx.redirect('back');
                }
            }
        } else {
            return ctx.redirect('back');
        }

        return ctx.render('error');
    }
});

export default indexRouter;
