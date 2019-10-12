import Router from '@koa/router';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { MapperApplication } from '../../models/applications/MapperApplication';
import { Team } from '../../models/Team';

const mappersChoiceAdminRouter = new Router();

mappersChoiceAdminRouter.prefix('/admin/mappersChoice');
mappersChoiceAdminRouter.use(authenticate);
mappersChoiceAdminRouter.use(isStaff);

mappersChoiceAdminRouter.get('/', async (ctx) => {
    const applications = await MapperApplication.find({ relations: ['user'] });
    const teams = await Team.find({ relations: ['country', 'users'] });

    return ctx.render('admin/mappersChoice', {
        applications,
        teams,
        user: ctx.state.user,
    });
});

mappersChoiceAdminRouter.post('/confirm', async (ctx) => {
    const team = await Team.findOneOrFail({ where: { id: ctx.request.body.teamId } });
    team.isCompeting = true;
    await team.save();

    return ctx.redirect('back');
});

mappersChoiceAdminRouter.post('/deny', async (ctx) => {
    const team = await Team.findOneOrFail({ where: { id: ctx.request.body.teamId } });
    team.isCompeting = false;
    await team.save();

    return ctx.redirect('back');
});

export default mappersChoiceAdminRouter;
