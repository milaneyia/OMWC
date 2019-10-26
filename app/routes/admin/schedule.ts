import Router from '@koa/router';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Schedule } from '../../models/Schedule';

const scheduleAdminRouter = new Router();

scheduleAdminRouter.prefix('/admin/schedule');
scheduleAdminRouter.use(authenticate);
scheduleAdminRouter.use(isStaff);

scheduleAdminRouter.get('/', async (ctx) => {
    const info = ctx.session.info;
    delete ctx.session.info;

    const schedule = await Schedule.findOne();

    return ctx.render('admin/schedule', {
        info,
        schedule,
        user: ctx.state.user,
    });
});

scheduleAdminRouter.post('/save', async (ctx) => {
    if (!ctx.request.body.applicationsStartedAt ||
        !ctx.request.body.captainApplicationsEndedAt ||
        !ctx.request.body.captainVotingStartedAt ||
        !ctx.request.body.captainVotingEndedAt ||
        !ctx.request.body.mapperApplicationsEndedAt ||
        !ctx.request.body.mappersChoiceStartedAt ||
        !ctx.request.body.mappersChoiceEndedAt ||
        !ctx.request.body.judgeApplicationsEndedAt ||
        !ctx.request.body.constestStartedAt ||
        !ctx.request.body.constestEndedAt ||
        ctx.request.body.applicationsStartedAt > ctx.request.body.captainApplicationsEndedAt ||
        ctx.request.body.applicationsStartedAt > ctx.request.body.mapperApplicationsEndedAt ||
        ctx.request.body.applicationsStartedAt > ctx.request.body.judgeApplicationsEndedAt ||
        ctx.request.body.captainVotingStartedAt > ctx.request.body.captainVotingEndedAt ||
        ctx.request.body.mappersChoiceStartedAt > ctx.request.body.mappersChoiceEndedAt ||
        ctx.request.body.constestStartedAt > ctx.request.body.constestEndedAt
        ) {

        ctx.session.info = `Dates don't make sense`;
        return ctx.redirect('back');
    }

    let schedule = await Schedule.findOne();

    if (!schedule) {
        schedule = new Schedule();
    }

    schedule.applicationsStartedAt = ctx.request.body.applicationsStartedAt;
    schedule.captainApplicationsEndedAt = ctx.request.body.captainApplicationsEndedAt;
    schedule.captainVotingStartedAt = ctx.request.body.captainVotingStartedAt;
    schedule.captainVotingEndedAt = ctx.request.body.captainVotingEndedAt;
    schedule.mapperApplicationsEndedAt = ctx.request.body.mapperApplicationsEndedAt;
    schedule.mappersChoiceStartedAt = ctx.request.body.mappersChoiceStartedAt;
    schedule.mappersChoiceEndedAt = ctx.request.body.mappersChoiceEndedAt;
    schedule.judgeApplicationsEndedAt = ctx.request.body.judgeApplicationsEndedAt;
    schedule.constestStartedAt = ctx.request.body.constestStartedAt;
    schedule.constestEndedAt = ctx.request.body.constestEndedAt;
    schedule.constestEndedAt = ctx.request.body.constestEndedAt;
    await schedule.save();

    return ctx.redirect('back');
});

export default scheduleAdminRouter;
