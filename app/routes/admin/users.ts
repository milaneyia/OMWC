import Router from '@koa/router';
import { convertToIntOrThrow } from '../../helpers';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { RequestAccess, STATUS } from '../../models/RequestAccess';
import { User } from '../../models/User';
import { ROLE } from '../../models/Role';

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
    const status = ctx.request.body.status;
    const id = convertToIntOrThrow(ctx.params.id);
    const request = await RequestAccess.findOneOrFail({
        where: { id },
        relations: ['user'],
    });
    request.status = status;
    await request.save();

    const user = await User.findOneOrFail({ id: request.user.id });

    if (status == STATUS.Accepted) {
        user.roleId = ROLE.ElevatedUser;
    } else if (status == STATUS.Rejected) {
        user.roleId = ROLE.BasicUser;
    }

    await user.save();
    const requests = await RequestAccess.find({ relations: ['user'] });

    ctx.body = {
        requests,
    };
});

export default usersAdminRouter;
