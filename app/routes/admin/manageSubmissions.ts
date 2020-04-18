import Router from '@koa/router';
import { convertToIntOrThrow } from '../../helpers';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Round } from '../../models/rounds/Round';
import { Submission } from '../../models/rounds/Submission';

const submissionsAdminRouter = new Router();

submissionsAdminRouter.prefix('/api/admin/manageSubmissions');
submissionsAdminRouter.use(authenticate);
submissionsAdminRouter.use(isStaff);

submissionsAdminRouter.get('/', async (ctx) => {
    const rounds = await Round.find({ relations: ['matches', 'matches.submissions', 'matches.submissions.country'] });
    const currentRound = await Round.findCurrentSubmissionRound();

    ctx.body = {
        rounds,
        currentRound,
    };
});

submissionsAdminRouter.post('/save', async (ctx) => {
    const submissionId = convertToIntOrThrow(ctx.request.body.submissionId);
    const submission = await Submission.findOneOrFail({ id: submissionId });

    if (!ctx.request.body.originalLink) {
        return ctx.body = {
            error: 'Not a valid link',
        };
    }

    submission.originalLink = ctx.request.body.originalLink.trim();
    submission.anonymisedAs = ctx.request.body.anonymisedAs.trim() || null;
    await submission.save();

    ctx.body = {
        success: 'ok',
    };
});

export default submissionsAdminRouter;
