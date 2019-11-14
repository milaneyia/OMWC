import Router from '@koa/router';
import { ROLE, Role } from '../models/Role';
import { User } from '../models/User';

const staffRouter = new Router();

staffRouter.prefix('/staff');

staffRouter.get('/', async (ctx) => {
    const users = await User.find({
        relations: ['role'],
        where: [
            { roleId: ROLE.Staff },
            { roleId: ROLE.Judge },
        ],
    });

    return await ctx.render('staff', {
        path: '/staff',
        users,
    });
});

export default staffRouter;
