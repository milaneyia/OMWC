import Router from '@koa/router';
import { authenticate, isElevatedUser } from '../../middlewares/authentication';
import { onGoingCaptainVoting } from '../../middlewares/scheduleCheck';
import { CaptainApplication } from '../../models/applications/CaptainApplication';
import { convertToIntOrThrow } from '../../helpers';

const captainVotingRouter = new Router();

captainVotingRouter.prefix('/api/applications/voting/');
captainVotingRouter.use(authenticate);
captainVotingRouter.use(isElevatedUser);
captainVotingRouter.use(onGoingCaptainVoting);

captainVotingRouter.get('/', async (ctx) => {
    const applications = await CaptainApplication
        .createQueryBuilder('captainApplication')
        .innerJoinAndSelect('captainApplication.user', 'user')
        .innerJoin('user.country', 'country')
        .where('country.id = :country', { country: ctx.state.user.country.id })
        .getMany();

    ctx.body = {
        applications,
    };
});

captainVotingRouter.post('/save', async (ctx) => {
    const applicationId = convertToIntOrThrow(ctx.request.body.applicationId);
    const application = await CaptainApplication.findOneOrFailWithUser(applicationId);
    const isAnotherPerson = application.user.id !== ctx.state.user.id;
    const isSameCountry = application.user.country.id === ctx.state.user.country.id;

    if (isSameCountry && isAnotherPerson) {
        const isCancelingVote = ctx.state.user.captainVoteId === application.id;

        if (isCancelingVote) {
            ctx.state.user.captainVoteId = null;
        } else {
            ctx.state.user.captainVoteId = application.id;
        }

        await ctx.state.user.save();

        return ctx.body = {
            application: isCancelingVote ? null : application,
        };
    }

    ctx.body = {
        error: `It's not a valid vote`,
    };
});

export default captainVotingRouter;
