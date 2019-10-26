import Router from '@koa/router';
import { convertToInt, convertToIntOrThrow } from '../../helpers';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { MapperApplication } from '../../models/applications/MapperApplication';
import { Team } from '../../models/Team';

const teamsChoiceAdminRouter = new Router();

teamsChoiceAdminRouter.prefix('/admin/teamsChoice');
teamsChoiceAdminRouter.use(authenticate);
teamsChoiceAdminRouter.use(isStaff);

teamsChoiceAdminRouter.get('/', async (ctx) => {
    const applications = await MapperApplication.find({ relations: ['user'] });
    const teams = await Team.find({ relations: ['country', 'users'] });

    return ctx.render('admin/teamsChoice', {
        applications,
        teams,
        user: ctx.state.user,
    });
});

teamsChoiceAdminRouter.post('/confirm', async (ctx) => {
    const teamId = convertToIntOrThrow(ctx.request.body.teamId);
    const team = await Team.findOneOrFail({ id: teamId });
    team.isCompeting = true;
    await team.save();

    return ctx.redirect('back');
});

teamsChoiceAdminRouter.post('/deny', async (ctx) => {
    const teamId = convertToIntOrThrow(ctx.request.body.teamId);
    const team = await Team.findOneOrFail({ id: teamId });
    team.isCompeting = false;
    await team.save();

    return ctx.redirect('back');
});

export default teamsChoiceAdminRouter;
