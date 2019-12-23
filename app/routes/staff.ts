import Router from '@koa/router';
import { ROLE, Role } from '../models/Role';
import { User } from '../models/User';

const staffRouter = new Router();

staffRouter.prefix('/staff');

staffRouter.get('/', async (ctx) => {
    const judges = await User.find({
        relations: ['role'],
        where: [
            { roleId: ROLE.Judge },
        ],
    });

    const osuId = ctx.session.osuId;
    let user;

    if (osuId) {
        user = await User.findOne({ osuId });
    }

    return await ctx.render('staff', {
        judges,
        path: '/staff',
        user,
    });
});

export default staffRouter;
