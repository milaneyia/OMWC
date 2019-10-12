import { ParameterizedContext } from 'koa';
import { User } from '../models/User';

export async function authenticate(ctx: ParameterizedContext, next: () => Promise<any>) {
    const user = await User.findOne({
        cache: true,
        relations: ['roles'],
        where: { osuId: ctx.session.osuId },
    });

    if (user && user.roles.length) {
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

export async function authUser(ctx: ParameterizedContext, next: () => Promise<any>) {
    const user = await User.findOne({ where: { osuId: ctx.session.osuId }});

    if (user) {
        ctx.state.user = user;
    }

    await next();
}

export async function isStaff(ctx: ParameterizedContext, next: () => Promise<any>) {
    if (User.isStaff(ctx.state.user)) {
        return await next();
    } else {
        return ctx.redirect('back');
    }
}

export async function isCaptain(ctx: ParameterizedContext, next: () => Promise<any>) {
    if (User.isCaptain(ctx.state.user) && ctx.state.user.teamId) {
        return await next();
    } else {
        return ctx.redirect('back');
    }
}
