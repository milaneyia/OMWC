import Router from '@koa/router';
import * as osuApi from '../middlewares/osuApi';
import { CaptainApplication } from '../models/applications/CaptainApplication';
import { JudgeApplication } from '../models/applications/JudgeApplication';
import { MapperApplication } from '../models/applications/MapperApplication';
import { Country } from '../models/Country';
import { ROLE } from '../models/Role';
import { Round } from '../models/rounds/Round';
import { Schedule } from '../models/Schedule';
import { User } from '../models/User';

const indexRouter = new Router();

indexRouter.get('/', async (ctx) => {
    const schedule = await Schedule.findOne({});
    const osuId = ctx.session.osuId;
    let user;
    let captainApplication;
    let mapperApplication;
    let judgeApplication;
    let judgingRound;
    let isCaptain = false;

    if (osuId) {
        user = await User.findOne({ where: { osuId }, relations: ['team'] });

        if (user) {
            captainApplication = await CaptainApplication.findUserApplication(user.id);
            mapperApplication = await MapperApplication.findUserApplication(user.id);
            judgeApplication = await JudgeApplication.findUserApplication(user.id);
            judgingRound = await Round.findCurrentJudgingRound();

            if (user.team && user.team.captainId === user.id) {
                isCaptain = true;
            }
        }
    }

    return await ctx.render('index', {
        captainApplication,
        isCaptain,
        judgeApplication,
        judgingRound,
        mapperApplication,
        path: '/',
        schedule,
        user,
    });
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
        return ctx.render('error');
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
            const newUser = await User.create({
                country,
                osuId: response.id,
                roleId: ROLE.User,
                username: response.username,
            }).save();

            if (newUser) {
                return ctx.redirect('back');
            }
        } else {
            return ctx.redirect('back');
        }

        return ctx.render('error');
    }
});

export default indexRouter;
