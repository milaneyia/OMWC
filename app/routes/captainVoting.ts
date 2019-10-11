import Router from '@koa/router';
import { authenticate } from '../middlewares/authentication';
import { CaptainApplication } from '../models/applications/CaptainApplication';
import { CaptainVote } from '../models/CaptainVote';

const captainVotingRouter = new Router();

captainVotingRouter.prefix('/captainVoting');
captainVotingRouter.use(authenticate);

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
    const application = await CaptainApplication.findOneWithUser(ctx.request.body.applicationId);
    const votesDone = await CaptainVote.findUserVotes(ctx.state.user);
    const hasVotedForIt = votesDone.find((v) => v.captainApplication.id === ctx.request.body.applicationId);

    if (application
        && application.user.country.id === ctx.state.user.country.id
        && !hasVotedForIt
        && application.user.id !== ctx.state.user.id
        ) {

        await CaptainVote.create({
            captainApplication: ctx.request.body.applicationId,
            user: ctx.state.user,
        }).save();

        return ctx.redirect('back');
    }

    return ctx.render('error');
});

captainVotingRouter.post('/destroy', async (ctx) => {
    const application = await CaptainApplication.findOneWithUser(ctx.request.body.applicationId);

    if (application && application.user.id === ctx.state.user.id) {
        await CaptainVote.delete({
            captainApplication: ctx.request.body.applicationId,
            user: ctx.state.user,
        });

        return ctx.redirect('back');
    }

    return ctx.render('error');
});

export default captainVotingRouter;
