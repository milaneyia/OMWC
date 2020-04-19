import { ParameterizedContext } from 'koa';
import { CaptainApplication } from '../models/applications/CaptainApplication';
import { MapperApplication } from '../models/applications/MapperApplication';
import { ROLE } from '../models/Role';
import { User } from '../models/User';

export async function authenticate(ctx: ParameterizedContext, next: () => Promise<any>): Promise<any> {
    const user = await User.findOne({
        cache: true,
        where: { osuId: ctx.session.osuId },
    });

    if (user && user.roleId !== ROLE.Restricted) {
        ctx.state.user = user;

        return await next();
    } else {
        if (ctx.request.type === 'application/json') {
            return ctx.body = { error: 'Unathorized' };
        } else {
            return ctx.redirect('back');
        }
    }
}

export async function isStaff(ctx: ParameterizedContext, next: () => Promise<any>): Promise<any> {
    if (User.isStaff(ctx.state.user)) {
        return await next();
    } else {
        return ctx.redirect('back');
    }
}

export async function isCaptain(ctx: ParameterizedContext, next: () => Promise<any>): Promise<any> {
    if (User.isCaptain(ctx.state.user)) {
        return await next();
    } else {
        return ctx.redirect('back');
    }
}

export async function isJudge(ctx: ParameterizedContext, next: () => Promise<any>): Promise<any> {
    if (User.isJudge(ctx.state.user)) {
        return await next();
    } else {
        return ctx.redirect('back');
    }
}

export async function isElevatedUser(ctx: ParameterizedContext, next: () => Promise<any>): Promise<any> {
    if (ctx.state.user.roleId === ROLE.UserElevated) {
        return await next();
    } else {
        return ctx.redirect('back');
    }
}


export async function isBasicUser(ctx: ParameterizedContext, next: () => Promise<any>): Promise<any> {
    if (ctx.state.user.roleId === ROLE.User) {
        return await next();
    } else {
        return ctx.redirect('back');
    }
}

export async function canVoteForCaptain(ctx: ParameterizedContext, next: () => Promise<any>): Promise<any> {
    const mapperApplication = await MapperApplication.findOne({ where: { userId: ctx.state.user.id } });
    const captainApplication = await CaptainApplication.findOne({ where: { userId: ctx.state.user.id } });

    if (mapperApplication || captainApplication) {
        return await next();
    } else {
        return ctx.redirect('back');
    }
}
