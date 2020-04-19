import Router from '@koa/router';
import { authenticate, canVoteForCaptain, isElevatedUser } from '../middlewares/authentication';
import { onGoingCaptainVoting } from '../middlewares/scheduleCheck';
import { CaptainApplication } from '../models/applications/CaptainApplication';

const captainVotingRouter = new Router();

captainVotingRouter.prefix('/api/captainVoting');
captainVotingRouter.use(authenticate);
captainVotingRouter.use(isElevatedUser);
captainVotingRouter.use(onGoingCaptainVoting);
captainVotingRouter.use(canVoteForCaptain);

captainVotingRouter.get('/', async (ctx) => {
    const applications = await CaptainApplication
        .createQueryBuilder('captainApplication')
        .innerJoinAndSelect('captainApplication.user', 'user')
        .innerJoin('user.country', 'country', 'country.id = :country', { country: ctx.state.user.country.id })
        .getMany();

    ctx.body = {
        applications,
    };
});

captainVotingRouter.post('/store', async (ctx) => {
    const applicationId = ctx.request.body.applicationId && parseInt(ctx.request.body.applicationId, 10);

    if (!applicationId || isNaN(applicationId)) {
        return ctx.body = {
            error: 'Not a valid app',
        };
    }

    const application = await CaptainApplication.findOneOrFailWithUser(applicationId);
    const hasVoted = ctx.state.user.captainVoteId;
    const isAnotherPerson = application.user.id !== ctx.state.user.id;
    const isSameCountry = application.user.country.id === ctx.state.user.country.id;

    if (isSameCountry && isAnotherPerson && !hasVoted) {
        // TODO: test this
        ctx.state.user.captainVoteId = application.id;
        await ctx.state.user.save();

        ctx.body = {
            success: 'ok',
        };
    }

    ctx.body = {
        error: `It's not a valid vote`,
    };
});

export default captainVotingRouter;
