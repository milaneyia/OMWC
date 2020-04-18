import Router from '@koa/router';
import { convertToIntOrThrow } from '../../helpers';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { CaptainApplication } from '../../models/applications/CaptainApplication';
import { Country } from '../../models/Country';
import { Schedule } from '../../models/Schedule';
import { User } from '../../models/User';
import { ROLE } from '../../models/Role';

const captainChoiceAdminRouter = new Router();

captainChoiceAdminRouter.prefix('/api/admin/captainChoice');
captainChoiceAdminRouter.use(authenticate);
captainChoiceAdminRouter.use(isStaff);

captainChoiceAdminRouter.get('/', async (ctx) => {
    const schedule = await Schedule.findOne();
    const applicationsByCountry = await Country
        .createQueryBuilder('country')
        .innerJoin('country.users', 'user')
        .innerJoinAndMapMany('country.captainApplications', CaptainApplication, 'captainApplication', 'user.id = captainApplication.userId')
        .leftJoin('captainApplication.user', 'captainApplicationUser')
        .leftJoin('captainApplication.captainVotes', 'captainVote')
        .leftJoin('captainVote.user', 'captainVoteUser')
        .select([
            'country.name',
            'country.code',
            'captainApplication.id',
            'captainApplicationUser.id',
            'captainApplicationUser.username',
            'captainVote.id',
            'captainVoteUser.username',
        ]).getMany();

    ctx.body = {
        applicationsByCountry,
        schedule,
    };
});

captainChoiceAdminRouter.post('/store', async (ctx) => {
    const applicationId = convertToIntOrThrow(ctx.request.body.applicationId);
    const application = await CaptainApplication.findOneOrFailWithUser(applicationId);
    const user = await User.findOneOrFail({ id: application.user.id });
    user.roleId = ROLE.Captain;
    await user.save();

    ctx.body = {
        success: 'ok',
    };
});

captainChoiceAdminRouter.post('/destroy', async (ctx) => {
    const applicationId = convertToIntOrThrow(ctx.request.body.applicationId);
    const application = await CaptainApplication.findOneOrFailWithUser(applicationId);
    const user = await User.findOneOrFail({ id: application.user.id });
    user.roleId = ROLE.UserElevated;
    await user.save();

    ctx.body = {
        success: 'ok',
    };
});

export default captainChoiceAdminRouter;
