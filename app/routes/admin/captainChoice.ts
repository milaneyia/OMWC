import Router from '@koa/router';
import { convertToIntOrThrow } from '../../helpers';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { CaptainApplication } from '../../models/applications/CaptainApplication';
import { Country } from '../../models/Country';
import { Schedule } from '../../models/Schedule';
import { Team } from '../../models/Team';
import { User } from '../../models/User';

const captainChoiceAdminRouter = new Router();

captainChoiceAdminRouter.prefix('/admin/captainChoice');
captainChoiceAdminRouter.use(authenticate);
captainChoiceAdminRouter.use(isStaff);

captainChoiceAdminRouter.get('/', async (ctx) => {
    const schedule = await Schedule.findOne();
    const applicationsByCountry = await Country
        .createQueryBuilder('country')
        .innerJoin('country.users', 'user')
        .innerJoinAndMapMany('country.captainApplications', CaptainApplication, 'captainApplication', 'user.id = captainApplication.userId')
        .leftJoin('captainApplication.user', 'captainApplicationUser')
        .leftJoin('captainApplicationUser.team', 'team')
        .leftJoin('captainApplication.captainVotes', 'captainVote')
        .leftJoin('captainVote.user', 'captainVoteUser')
        .select([
            'country.name',
            'country.code',
            'captainApplication.id',
            'captainApplicationUser.id',
            'captainApplicationUser.username',
            'team.captainId',
            'captainVote.id',
            'captainVoteUser.username',
        ]).getMany();

    return ctx.render('admin/captainChoice', {
        applicationsByCountry,
        schedule,
        user: ctx.state.user,
    });
});

captainChoiceAdminRouter.post('/store', async (ctx) => {
    const applicationId = convertToIntOrThrow(ctx.request.body.applicationId);
    const application = await CaptainApplication.findOneOrFailWithUser(applicationId);
    const user = await User.findOneOrFail({ id: application.user.id });
    let team = await Team.findOne({ countryId: user.country.id });

    if (!team) {
        team = new Team();
        team.countryId = user.country.id;
    }

    team.captainId = user.id;
    team = await team.save();
    user.team = team;
    await user.save();

    return ctx.redirect('back');
});

captainChoiceAdminRouter.post('/destroy', async (ctx) => {
    const applicationId = convertToIntOrThrow(ctx.request.body.applicationId);
    const application = await CaptainApplication.findOneOrFailWithUser(applicationId);
    const user = await User.findOneOrFail({ id: application.user.id });

    if (user.teamId) {
        const team = await Team.findOneOrFail({ id: user.teamId });
        team.captainId = null;
        user.teamId = null;
        await team.save();
        await user.save();
    }

    return ctx.redirect('back');
});

export default captainChoiceAdminRouter;
