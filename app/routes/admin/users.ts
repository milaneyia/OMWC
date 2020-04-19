import Router from '@koa/router';
import { convertToIntOrThrow } from '../../helpers';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { RequestAccess } from '../../models/RequestAccess';

const usersAdminRouter = new Router();

usersAdminRouter.prefix('/api/admin/users');
usersAdminRouter.use(authenticate);
usersAdminRouter.use(isStaff);

usersAdminRouter.get('/access/', async (ctx) => {
    const requests = await RequestAccess.find({ relations: ['user'] });

    ctx.body = {
        requests,
    };
});

usersAdminRouter.post('/access/:id/save', async (ctx) => {
    const id = convertToIntOrThrow(ctx.params.id);
    const request = await RequestAccess.findOneOrFail({ id });
    request.wasAccepted = !request.wasAccepted;
    await request.save();

    ctx.body = {
        request,
    };
});

export default usersAdminRouter;
