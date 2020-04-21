import Router from '@koa/router';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Schedule } from '../../models/Schedule';

const scheduleAdminRouter = new Router();

scheduleAdminRouter.prefix('/api/admin/schedule');
scheduleAdminRouter.use(authenticate);
scheduleAdminRouter.use(isStaff);

scheduleAdminRouter.post('/save', async (ctx) => {
    if (!ctx.request.body.applicationsStartedAt.date ||
        !ctx.request.body.applicationsEndedAt.date ||
        !ctx.request.body.captainVotingStartedAt.date ||
        !ctx.request.body.captainVotingEndedAt.date ||
        !ctx.request.body.mappersChoiceStartedAt.date ||
        !ctx.request.body.mappersChoiceEndedAt.date ||
        !ctx.request.body.contestStartedAt.date ||
        !ctx.request.body.contestEndedAt.date ||
        ctx.request.body.applicationsStartedAt.date > ctx.request.body.applicationsEndedAt.date ||
        ctx.request.body.captainVotingStartedAt.date > ctx.request.body.captainVotingEndedAt.date ||
        ctx.request.body.mappersChoiceStartedAt.date > ctx.request.body.mappersChoiceEndedAt.date ||
        ctx.request.body.contestStartedAt.date > ctx.request.body.contestEndedAt.date
    ) {

        return ctx.body = {
            error: `Dates don't make sense`,
        };
    }

    let schedule = await Schedule.findOne();

    if (!schedule) {
        schedule = new Schedule();
    }

    schedule.applicationsStartedAt = ctx.request.body.applicationsStartedAt.date;
    schedule.applicationsEndedAt = ctx.request.body.applicationsEndedAt.date;
    schedule.captainVotingStartedAt = ctx.request.body.captainVotingStartedAt.date;
    schedule.captainVotingEndedAt = ctx.request.body.captainVotingEndedAt.date;
    schedule.mappersChoiceStartedAt = ctx.request.body.mappersChoiceStartedAt.date;
    schedule.mappersChoiceEndedAt = ctx.request.body.mappersChoiceEndedAt.date;
    schedule.contestStartedAt = ctx.request.body.contestStartedAt.date;
    schedule.contestEndedAt = ctx.request.body.contestEndedAt.date;
    await schedule.save();

    ctx.body = schedule;
});

export default scheduleAdminRouter;
