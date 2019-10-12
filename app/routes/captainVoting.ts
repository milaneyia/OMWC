import Router from '@koa/router';
import { authenticate, canVoteForCaptain } from '../middlewares/authentication';
import { onGoingCaptainVoting } from '../middlewares/scheduleCheck';
import { CaptainApplication } from '../models/applications/CaptainApplication';
import { CaptainVote } from '../models/CaptainVote';

const captainVotingRouter = new Router();

captainVotingRouter.prefix('/captainVoting');
captainVotingRouter.use(authenticate);
captainVotingRouter.use(onGoingCaptainVoting);
captainVotingRouter.use(canVoteForCaptain);

captainVotingRouter.get('/', async (ctx) => {
    const applications = await CaptainApplication
        .createQueryBuilder('captainApplication')
        .innerJoinAndSelect('captainApplication.user', 'user')
        .innerJoin('user.country', 'country', 'country.id = :country', { country: ctx.state.user.country.id })
        .getMany();

    const votesDone = await CaptainVote.findUserVotes(ctx.state.user);

    return ctx.render('captainVoting', {
        applications,
        user: ctx.state.user,
        votesDone,
    });
});

captainVotingRouter.post('/store', async (ctx) => {
    const application = await CaptainApplication.findOneOrFailWithUser(ctx.request.body.applicationId);
    const votesDone = await CaptainVote.findUserVotes(ctx.state.user);

    const hasVotedForIt = votesDone.find((v) => v.captainApplication.id === application.id);
    const isAnotherPerson = application.user.id !== ctx.state.user.id;
    const isSameCountry = application.user.country.id === ctx.state.user.country.id;

    if (isSameCountry && isAnotherPerson && !hasVotedForIt) {
        await CaptainVote.create({
            captainApplication: application,
            user: ctx.state.user,
        }).save();

        return ctx.redirect('back');
    }

    return ctx.render('error');
});

captainVotingRouter.post('/destroy', async (ctx) => {
    const vote = await CaptainVote.findOneOrFail({
        where: {
            captainApplicationId: ctx.request.body.applicationId,
            userId: ctx.state.user.Id,
        },
    });

    await vote.remove();

    return ctx.redirect('back');
});

export default captainVotingRouter;
