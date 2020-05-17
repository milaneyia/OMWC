import Router from '@koa/router';
import { convertToIntOrThrow } from '../../helpers';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { CaptainApplication } from '../../models/applications/CaptainApplication';
import { Country } from '../../models/Country';
import { User } from '../../models/User';
import { ROLE } from '../../models/Role';

const captainChoiceAdminRouter = new Router();

captainChoiceAdminRouter.prefix('/api/admin/captainChoice');
captainChoiceAdminRouter.use(authenticate);
captainChoiceAdminRouter.use(isStaff);

captainChoiceAdminRouter.get('/', async (ctx) => {
    const applicationsByCountry = await Country
        .createQueryBuilder('country')
        .innerJoin('country.users', 'user')
        .innerJoin('user.captainApplication', 'captainApplication')
        .leftJoin('captainApplication.userVotes', 'userVote')
        .select([
            'country.name',
            'country.code',
            'user.osuId',
            'user.username',
            'user.roleId',
            'captainApplication.id',
            'captainApplication.reason',
            'userVote.osuId',
            'userVote.username',
        ])
        .orderBy('country.name', 'ASC')
        .getMany();

    ctx.body = {
        applicationsByCountry,
    };
});

captainChoiceAdminRouter.post('/choose', async (ctx) => {
    const applicationId = convertToIntOrThrow(ctx.request.body.applicationId);
    const application = await CaptainApplication.findOneOrFailWithUser(applicationId);
    const user = await User.findOneOrFail({ id: application.user.id });
    const currentCaptain = await User.findOne({
        roleId: ROLE.Captain,
        country: user.country,
    });

    if (currentCaptain) {
        return ctx.body = {
            error: `There's already a captain for the team`,
        };
    }

    user.roleId = ROLE.Captain;
    await user.save();

    ctx.body = {
        success: 'ok',
    };
});

captainChoiceAdminRouter.post('/remove', async (ctx) => {
    const applicationId = convertToIntOrThrow(ctx.request.body.applicationId);
    const application = await CaptainApplication.findOneOrFailWithUser(applicationId);
    const user = await User.findOneOrFail({ id: application.user.id });
    user.roleId = ROLE.ElevatedUser;
    await user.save();

    ctx.body = {
        success: 'ok',
    };
});

export default captainChoiceAdminRouter;
