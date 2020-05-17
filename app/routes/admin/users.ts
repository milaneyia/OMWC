import Router from '@koa/router';
import { convertToIntOrThrow } from '../../helpers';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { RequestAccess, STATUS } from '../../models/RequestAccess';
import { User } from '../../models/User';
import { ROLE, Role } from '../../models/Role';
import { MapperApplication } from '../../models/applications/MapperApplication';
import { Log, LOG_TYPE } from '../../models/Log';
import { Not, Like } from 'typeorm';

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

usersAdminRouter.get('/roles', async (ctx) => {
    const roles = await Role.find({
        id: Not(ROLE.Staff),
    });

    ctx.body = {
        roles,
    };
});

usersAdminRouter.get('/query', async (ctx) => {
    const query = ctx.query.u;
    const users = await User.find({
        where: [
            { username: Like(`%${query}%`) },
            { osuId: query },
        ],
    });

    ctx.body = {
        users,
    };
});

usersAdminRouter.post('/:id/createMapperApplication', async (ctx) => {
    const user = await User.findOneOrFail({
        id: ctx.params.id,
    });

    if (user.mapperApplicationId) {
        return ctx.body = {
            error: 'Already applied',
        };
    }

    const app = new MapperApplication();
    app.user = user;
    await app.save();

    ctx.body = {
        app,
    };
});

usersAdminRouter.post('/:id/updateRole', async (ctx) => {
    const roleId = convertToIntOrThrow(ctx.request.body.roleId);

    if (roleId === ROLE.Staff) {
        return ctx.body = {
            error: 'Not a valid role',
        };
    }

    const [user, role] = await Promise.all([
        User.findOneOrFail({
            id: ctx.params.id,
            roleId: Not(ROLE.Staff),
        }),
        Role.findOneOrFail({
            id: roleId,
        }),
    ]);

    if (role.id === ROLE.Captain) {
        const existentCaptain = await User.findOne({
            roleId: ROLE.Captain,
            country: user.country,
            id: Not(user.id),
        });

        if (existentCaptain) {
            return ctx.body = {
                error: `There's a captain for the country already`,
            };
        }
    }

    user.roleId = role.id;
    await user.save();

    ctx.body = {
        success: 'Updated',
    };

    await Log.createAndSave(`${ctx.state.user.username} changed ${user.username} role to ${role.name}`, LOG_TYPE.Admin);
});

export default usersAdminRouter;
