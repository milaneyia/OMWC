import Router from '@koa/router';
import { isUrl } from '../helpers';
import { authenticate, isCaptain } from '../middlewares/authentication';
import { Round } from '../models/rounds/Round';
import { Submission } from '../models/rounds/Submission';

const submissionsRouter = new Router();

submissionsRouter.prefix('/api/submissions');
submissionsRouter.use(authenticate);
submissionsRouter.use(isCaptain);
submissionsRouter.use(async (ctx, next) => {
    if (ctx.state.user.country.isCompeting) {
        await next();
    } else {
        return ctx.body = {
            error: 'Your team is not competing',
        };
    }
});

submissionsRouter.get('/', async (ctx) => {
    // TODO: link to currentround
    const submissions = await Submission.find({
        relations: ['round'],
        where: { country: ctx.state.user.country },
    });

    const currentRound = await Round.findCurrentSubmissionRound();
    let currentSubmission: Submission | undefined;

    if (currentRound) {
        // currentSubmission = await Submission.findOne({
        //     match: currentRound.id,
        //     teamId: ctx.state.user.team.id,
        // });
    }

    ctx.body = {
        currentRound,
        currentSubmission,
        submissions,
    };
});

submissionsRouter.post('/save', async (ctx) => {
    // TODO: link to currentround
    const currentRound = await Round.findCurrentSubmissionRound();

    if (!currentRound) {
        return ctx.throw(500, 'No round in progress');
    }

    if (!isUrl(ctx.request.body.oszFile)) {
        ctx.session.info = 'Not a valid link';

        return ctx.redirect('back');
    }

    let submission = await Submission.findOne({
        // roundId: currentRound.id,
        country: ctx.state.user.country,
    });

    if (!submission) {
        submission = new Submission();
    }

    // submission.roundId = currentRound.id;
    submission.country = ctx.state.user.country;
    submission.originalLink = ctx.request.body.oszFile;
    await submission.save();

    ctx.body = {
        success: 'ok',
    };
});

export default submissionsRouter;
