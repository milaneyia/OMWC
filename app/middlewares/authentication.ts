import { ParameterizedContext } from 'koa';
import { User } from '../models/User';
import { refreshToken, isRequestError } from './osuApi';

export async function authenticate(ctx: ParameterizedContext, next: () => Promise<any>): Promise<any> {
    const user = await User.findOne({
        cache: true,
        where: { osuId: ctx.session!.osuId },
    });

    if (user && !user.isRestricted) {
        ctx.state.user = user;

        const expireDate = new Date(ctx.session!.expiresAt);
        expireDate.setHours(expireDate.getHours() - 5);

        if (new Date() > expireDate) {
            const response = await refreshToken(ctx.session!.refreshToken);

            if (isRequestError(response)) {
                ctx.session = null;

                return ctx.body = { error: 'Re-login..' };
            }

            ctx.session!.maxAge = 172800000;
            ctx.session!.expireAt = new Date(Date.now() + (response.expires_in * 1000));
            ctx.session!.accessToken = response.access_token;
            ctx.session!.refreshToken = response.refresh_token;
        }

        return await next();
    }

    return ctx.body = { error: 'Unauthorized' };
}

export async function isStaff(ctx: ParameterizedContext, next: () => Promise<any>): Promise<any> {
    if (ctx.state.user.isStaff) {
        return await next();
    }

    return ctx.body = { error: 'Unauthorized' };
}

export async function isCaptain(ctx: ParameterizedContext, next: () => Promise<any>): Promise<any> {
    if (ctx.state.user.isCaptain) {
        return await next();
    }

    return ctx.body = { error: 'Unauthorized' };
}

export async function isJudge(ctx: ParameterizedContext, next: () => Promise<any>): Promise<any> {
    if (ctx.state.user.isJudge) {
        return await next();
    }

    return ctx.body = { error: 'Unauthorized' };
}

export async function isElevatedUser(ctx: ParameterizedContext, next: () => Promise<any>): Promise<any> {
    if (ctx.state.user.isElevatedUser) {
        return await next();
    }

    return ctx.body = { error: 'Unauthorized' };
}

export async function isBasicUser(ctx: ParameterizedContext, next: () => Promise<any>): Promise<any> {
    if (ctx.state.user.isBasicUser) {
        return await next();
    }

    return ctx.body = { error: 'Unauthorized' };
}
