/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Router from '@koa/router';
import * as osuApi from '../middlewares/osuApi';
import { Country } from '../models/Country';
import { ROLE } from '../models/Role';
import { Round } from '../models/rounds/Round';
import { Schedule } from '../models/Schedule';
import { User } from '../models/User';
import { Context, DefaultState } from 'koa';

const indexRouter = new Router<DefaultState, Context>();

indexRouter.get('/api/', async (ctx) => {
    const schedule = await Schedule.findOne({});
    const judgingRound = await Round.findCurrentJudgingRound();
    const osuId = ctx.session?.osuId;
    let user;

    if (osuId) {
        user = await User.findOneWithRelevantInfo(osuId);
    }

    ctx.body = {
        judgingRound,
        schedule,
        user,
    };
});

indexRouter.get('/login', (ctx) => {
    const state = osuApi.generateState();
    ctx.cookies.set('_state', state);
    ctx.session!.redirectTo = ctx.request.header.referer;

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

    const response = await osuApi.getToken(ctx.query.code);

    if (osuApi.isRequestError(response)) {
        return ctx.render('error');
    } else {
        ctx.session!.accessToken = response.access_token;
        ctx.session!.refreshToken = response.refresh_token;

        const userResponse = await osuApi.getUserInfo(response.access_token);

        if (osuApi.isRequestError(userResponse)) {
            ctx.session = null;

            return ctx.render('error');
        }

        ctx.session!.osuId = userResponse.id;
        ctx.session!.username = userResponse.username;

        let country = await Country.findOne({ where: { name: userResponse.country.name } });

        if (!country) {
            country = await Country.create({
                code: userResponse.country.code,
                name: userResponse.country.name,
            }).save();
        }

        let user = await User.findOne({ where: { osuId: userResponse.id } });

        if (!user) {
            const hasRankedMap = userResponse.ranked_and_approved_beatmapset_count > 0;
            user = await User.create({
                country,
                osuId: userResponse.id,
                roleId: hasRankedMap ? ROLE.ElevatedUser : ROLE.BasicUser,
                username: userResponse.username,
            }).save();
        }

        if  (user) {
            const redirectUrl = ctx.session?.redirectTo || '/';
            ctx.session!.redirectUrl = null;

            return ctx.redirect(redirectUrl);
        }

        ctx.session = null;

        return ctx.render('error');
    }
});

export default indexRouter;
