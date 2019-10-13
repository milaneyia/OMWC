import Router from '@koa/router';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { JudgeApplication } from '../../models/applications/JudgeApplication';
import { ROLE } from '../../models/Role';
import { User } from '../../models/User';

const judgesChoiceAdminRouter = new Router();

judgesChoiceAdminRouter.prefix('/admin/judgesChoice');
judgesChoiceAdminRouter.use(authenticate);
judgesChoiceAdminRouter.use(isStaff);

judgesChoiceAdminRouter.get('/', async (ctx) => {
    const applications = await JudgeApplication.find({ relations: ['user'] });
    const currentJudges = await User.find({ where: { roleId: ROLE.Judge } });

    return ctx.render('admin/judgesChoice', {
        applications,
        currentJudges,
    });
});

judgesChoiceAdminRouter.post('/store', async (ctx) => {
    const user = await User.findOneOrFail({ where: { id: ctx.request.body.userId } });

    if (user.teamId) {
        return ctx.render('error', { error: 'User has a team' });
    }

    user.roleId = ROLE.Judge;
    await user.save();

    return ctx.redirect('back');
});

judgesChoiceAdminRouter.post('/destroy', async (ctx) => {
    const user = await User.findOneOrFail({ where: { id: ctx.request.body.userId } });
    user.roleId = ROLE.User;
    await user.save();

    return ctx.redirect('back');
});

export default judgesChoiceAdminRouter;
