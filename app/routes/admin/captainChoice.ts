import Router from '@koa/router';
import { getManager } from 'typeorm';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { CaptainApplication } from '../../models/applications/CaptainApplication';
import { Country } from '../../models/Country';
import { ROLE, Role } from '../../models/Role';
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
        .innerJoin('captainApplication.user', 'captainApplicationUser')
        .innerJoin('captainApplicationUser.roles', 'roles')
        .innerJoin('captainApplication.captainVotes', 'captainVote')
        .innerJoin('captainVote.user', 'captainVoteUser')
        .select([
            'country.name',
            'country.code',
            'captainApplication.id',
            'captainApplicationUser.username',
            'roles.name',
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
    const application = await CaptainApplication.findOneWithUser(ctx.request.body.applicationId);

    if (!application) {
        return ctx.render('error');
    }

    const alreadyHasCaptain = await User
        .createQueryBuilder('user')
        .innerJoin('user.roles', 'role', `role.id = ${ROLE.Captain}`)
        .innerJoin('user.captainApplication', 'captainApplication')
        .where('user.countryId = :countryId', { countryId: application.user.country.id })
        .getOne();

    if (!alreadyHasCaptain) {
        const user = await User.findOneWithRoles(application.user.id);
        const role = await Role.findOne({ where: { id: ROLE.Captain } });
        let team = await Team.findOne({ where: { country: application.user.country } });

        if (!user || !role) {
            return ctx.render('error');
        }

        if (!team) {
            team = await Team.create({
                country: application.user.country,
            }).save();
        }

        user.team = team;
        user.roles.push(role);
        await user.save();
    }

    return ctx.redirect('back');
});

captainChoiceAdminRouter.post('/destroy', async (ctx) => {
    const application = await CaptainApplication.findOneWithUser(ctx.request.body.applicationId);

    if (!application) {
        return ctx.render('error');
    }

    const user = await User.findOneWithRoles(application.user.id);

    if (!user) {
        return ctx.render('error');
    }

    const i = user.roles.findIndex((r) => r.id === ROLE.Captain);

    if (i !== -1) {
        user.roles.splice(i, 1);
    }

    user.team = null;
    await user.save();

    return ctx.redirect('back');
});

export default captainChoiceAdminRouter;
