import Router from '@koa/router';
import { isUrl } from '../helpers';
import { authenticate, isCaptain } from '../middlewares/authentication';
import { Round } from '../models/rounds/Round';
import { Submission } from '../models/rounds/Submission';
import { Match } from '../models/rounds/Match';

const submissionsRouter = new Router();

submissionsRouter.prefix('/api/submissions');
submissionsRouter.use(authenticate);
submissionsRouter.use(isCaptain);
submissionsRouter.use(async (ctx, next) => {
    if (ctx.state.user.country.wasConfirmed) {
        await next();
    } else {
        return ctx.body = {
            error: 'Your team is not competing',
        };
    }
});

submissionsRouter.get('/', async (ctx) => {
    const submissions = await Submission.find({
        where: { country: ctx.state.user.country },
        relations: ['match', 'match.round'],
    });
    const currentRound = await Round.findCurrentSubmissionRound();
    let currentMatch;

    if (currentRound) {
        currentMatch = await Match.findRelatedCountryMatch(currentRound, ctx.state.user.country.id);
    }

    ctx.body = {
        currentRound,
        currentMatch,
        submissions,
    };
});

submissionsRouter.post('/save', async (ctx) => {
    const currentRound = await Round.findCurrentSubmissionRound();
    const oszLink: string = ctx.request.body.oszLink;

    if (!currentRound) {
        return ctx.body = {
            error: 'No round in progress',
        };
    }

    if (!isUrl(oszLink)) {
        return ctx.body = {
            error: 'Not a valid link',
        };
    }

    const captainCountry = ctx.state.user.country;
    const match = await Match.findRelatedCountryMatch(currentRound, captainCountry.id);

    if (!match) {
        return ctx.body = {
            error: `Your team isn't competeting`,
        };
    }

    let submission = await Submission.findOne({
        country: captainCountry,
        match,
    });

    if (!submission) {
        submission = new Submission();
        submission.match = match;
        submission.country = ctx.state.user.country;
    }

    submission.originalLink = oszLink;
    await submission.save();

    ctx.body = {
        success: 'ok',
    };
});

export default submissionsRouter;
