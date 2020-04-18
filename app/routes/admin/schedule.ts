import Router from '@koa/router';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Schedule } from '../../models/Schedule';

const scheduleAdminRouter = new Router();

scheduleAdminRouter.prefix('/admin/schedule');
scheduleAdminRouter.use(authenticate);
scheduleAdminRouter.use(isStaff);

scheduleAdminRouter.get('/', async (ctx) => {
    const schedule = await Schedule.findOne();

    ctx.body = {
        schedule,
        user: ctx.state.user,
    };
});

scheduleAdminRouter.post('/save', async (ctx) => {
    if (!ctx.request.body.applicationsStartedAt ||
        !ctx.request.body.applicationsEndedAt ||
        !ctx.request.body.captainVotingStartedAt ||
        !ctx.request.body.captainVotingEndedAt ||
        !ctx.request.body.mappersChoiceStartedAt ||
        !ctx.request.body.mappersChoiceEndedAt ||
        !ctx.request.body.constestStartedAt ||
        !ctx.request.body.constestEndedAt ||
        ctx.request.body.applicationsStartedAt > ctx.request.body.applicationsEndedAt ||
        ctx.request.body.captainVotingStartedAt > ctx.request.body.captainVotingEndedAt ||
        ctx.request.body.mappersChoiceStartedAt > ctx.request.body.mappersChoiceEndedAt ||
        ctx.request.body.constestStartedAt > ctx.request.body.constestEndedAt
    ) {

        return ctx.body = {
            error: `Dates don't make sense`,
        };
    }

    let schedule = await Schedule.findOne();

    if (!schedule) {
        schedule = new Schedule();
    }

    schedule.applicationsStartedAt = ctx.request.body.applicationsStartedAt;
    schedule.applicationsEndedAt = ctx.request.body.applicationsEndedAt;
    schedule.captainVotingStartedAt = ctx.request.body.captainVotingStartedAt;
    schedule.captainVotingEndedAt = ctx.request.body.captainVotingEndedAt;
    schedule.mappersChoiceStartedAt = ctx.request.body.mappersChoiceStartedAt;
    schedule.mappersChoiceEndedAt = ctx.request.body.mappersChoiceEndedAt;
    schedule.contestStartedAt = ctx.request.body.contestStartedAt;
    schedule.contestEndedAt = ctx.request.body.contestEndedAt;
    await schedule.save();

    ctx.body = {
        success: 'ok',
    };
});

export default scheduleAdminRouter;
