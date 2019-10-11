import { ParameterizedContext } from 'koa';
import { User } from '../models/User';

export async function authenticate(ctx: ParameterizedContext, next: () => Promise<any>) {
    const user = await User.findOne({ where: { osuId:  ctx.session.osuId } });

    if (user) {
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
    const user = await User.findOne({ where: { osuId:  ctx.session.osuId }});

    if (user) {
        ctx.state.user = user;
    }

    await next();
}
