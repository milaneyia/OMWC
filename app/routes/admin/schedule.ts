import Router from '@koa/router';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Schedule } from '../../models/Schedule';

const scheduleAdminRouter = new Router();

scheduleAdminRouter.prefix('/admin/schedule');
scheduleAdminRouter.use(authenticate);
scheduleAdminRouter.use(isStaff);

scheduleAdminRouter.get('/', async (ctx) => {
    const schedule = await Schedule.findOne();

    return ctx.render('admin/schedule', {
        schedule,
        user: ctx.state.user,
    });
});

scheduleAdminRouter.post('/save', async (ctx) => {
    let schedule = await Schedule.findOne();

    if (!schedule) {
        schedule = new Schedule();
    }

    schedule.applicationsStartedAt = ctx.request.body.applicationsStartedAt;
    schedule.captainApplicationsEndedAt = ctx.request.body.captainApplicationsEndedAt || null;
    schedule.captainVotingStartedAt = ctx.request.body.captainVotingStartedAt || null;
    schedule.captainVotingEndedAt = ctx.request.body.captainVotingEndedAt || null;
    schedule.mapperApplicationsEndedAt = ctx.request.body.mapperApplicationsEndedAt || null;
    schedule.mappersChoiceStartedAt = ctx.request.body.mappersChoiceStartedAt || null;
    schedule.mappersChoiceEndedAt = ctx.request.body.mappersChoiceEndedAt || null;
    schedule.judgeApplicationsEndedAt = ctx.request.body.judgeApplicationsEndedAt || null;
    schedule.constestStartedAt = ctx.request.body.constestStartedAt || null;
    schedule.constestEndedAt = ctx.request.body.constestEndedAt || null;
    schedule.constestEndedAt = ctx.request.body.constestEndedAt || null;
    await schedule.save();

    return ctx.redirect('back');
});

export default scheduleAdminRouter;
