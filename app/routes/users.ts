import Router from '@koa/router';
import { authenticate, isBasicUser } from '../middlewares/authentication';
import { RequestAccess } from '../models/RequestAccess';

const usersRouter = new Router();

usersRouter.prefix('/api/users');
usersRouter.use(authenticate);

usersRouter.post('/access/request', isBasicUser, async (ctx) => {
    let request = await RequestAccess.findOne({ user: ctx.state.user });

    if (!request) {
        request = new RequestAccess();
        request.mapLink = ctx.body.mapLink;
    }

    request.user = ctx.state.user;
    await request.save();

    ctx.body = {
        success: 'ok',
    };
});

export default usersRouter;
