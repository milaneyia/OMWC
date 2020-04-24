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

    let request = await RequestAccess.findOne({ user: ctx.state.user });

    if (request) {
        return ctx.body = {
            error: `You've already requested access`,
        };
    }

    request = new RequestAccess();
    request.mapLink = ctx.request.body.mapLink;
    request.user = ctx.state.user;
    await request.save();

    const user = await User.findOneOrFailWithRelevantInfo(ctx.state.user.osuId);

    ctx.body = {
        user,
    };
});

export default usersRouter;
