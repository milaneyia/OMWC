import Router from '@koa/router';
import { authenticate, isCaptain } from '../middlewares/authentication';
import { Round } from '../models/rounds/Round';
import { Submission } from '../models/rounds/Submission';

const submissionsRouter = new Router();

submissionsRouter.prefix('/submissions');
submissionsRouter.use(authenticate);
submissionsRouter.use(isCaptain);
submissionsRouter.use(async (ctx, next) => {
    if (ctx.state.user.team.isCompeting) {
        await next();
    } else {
        return ctx.render('error', 'Your team is not competing');
    }
});

submissionsRouter.get('/', async (ctx) => {
    const submissions = await Submission.find({
        relations: ['round'],
        where: { teamId: ctx.state.user.team.id },
    });

    const currentRound = await Round.findCurrentRound();
    let currentSubmission: Submission | undefined;

    if (currentRound) {
        currentSubmission = await Submission.findOne({
            where: {
                roundId: currentRound.id,
                teamId: ctx.state.user.team.id,
            },
        });
    }

    return ctx.render('submissions', {
        currentRound,
        currentSubmission,
        submissions,
        user: ctx.state.user,
    });
});

submissionsRouter.post('/save', async (ctx) => {
    const currentRound = await Round.findCurrentRound();

    if (!currentRound || !ctx.request.body.oszFile) {
        return ctx.render('error');
    }

    let submission = await Submission.findOne({
        where: {
            roundId: currentRound.id,
            teamId: ctx.state.user.team.id,
        },
    });

    if (!submission) {
        submission = new Submission();
    }

    submission.roundId = currentRound.id;
    submission.teamId = ctx.state.user.team.id;
    submission.originalLink = ctx.request.body.oszFile;
    await submission.save();

    return ctx.redirect('back');
});

export default submissionsRouter;
