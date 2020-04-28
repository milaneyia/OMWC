import Router from '@koa/router';
import { authenticate, isBasicUser } from '../middlewares/authentication';
import { RequestAccess } from '../models/RequestAccess';
import { User } from '../models/User';
import { isOsuUrl } from '../helpers';

const usersRouter = new Router();

usersRouter.prefix('/api/users');
usersRouter.use(authenticate);

usersRouter.post('/requestAccess', isBasicUser, async (ctx) => {
    if (!isOsuUrl(ctx.request.body.mapLink)) {
        return ctx.body = {
            error: `Not a valid link`,
        };
    }

    let user: User = ctx.state.user;

    if (user.requestAccessId) {
        return ctx.body = {
            error: `You've already requested access`,
        };
    }

    const request = new RequestAccess();
    request.mapLink = ctx.request.body.mapLink;
    request.user = ctx.state.user;
    await request.save();

    user = await User.findOneOrFailWithRelevantInfo(ctx.state.user.osuId);

    ctx.body = {
        user,
    };
});

export default usersRouter;
