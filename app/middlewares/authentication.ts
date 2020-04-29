/* eslint-disable @typescript-eslint/no-explicit-any */
import { ParameterizedContext } from 'koa';
import { User } from '../models/User';

export async function authenticate(ctx: ParameterizedContext, next: () => Promise<any>): Promise<any> {
    const user = await User.findOne({
        cache: true,
        where: { osuId: ctx.session.osuId },
    });

    if (user && !user.isRestricted) {
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
    if (ctx.state.user.isStaff) {
        return await next();
    } else {
        if (ctx.request.type === 'application/json') {
            return ctx.body = { error: 'Unathorized' };
        } else {
            return ctx.redirect('back');
        }
    }
}

export async function isCaptain(ctx: ParameterizedContext, next: () => Promise<any>): Promise<any> {
    if (ctx.state.user.isCaptain) {
        return await next();
    } else {
        if (ctx.request.type === 'application/json') {
            return ctx.body = { error: 'Unathorized' };
        } else {
            return ctx.redirect('back');
        }
    }
}

export async function isJudge(ctx: ParameterizedContext, next: () => Promise<any>): Promise<any> {
    if (ctx.state.user.isJudge) {
        return await next();
    } else {
        if (ctx.request.type === 'application/json') {
            return ctx.body = { error: 'Unathorized' };
        } else {
            return ctx.redirect('back');
        }
    }
}

export async function isElevatedUser(ctx: ParameterizedContext, next: () => Promise<any>): Promise<any> {
    if (ctx.state.user.isElevatedUser) {
        return await next();
    } else {
        if (ctx.request.type === 'application/json') {
            return ctx.body = { error: 'Unathorized' };
        } else {
            return ctx.redirect('back');
        }
    }
}

export async function isBasicUser(ctx: ParameterizedContext, next: () => Promise<any>): Promise<any> {
    if (ctx.state.user.isBasicUser) {
        return await next();
    } else {
        if (ctx.request.type === 'application/json') {
            return ctx.body = { error: 'Unathorized' };
        } else {
            return ctx.redirect('back');
        }
    }
}
