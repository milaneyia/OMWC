import Router from '@koa/router';
import { convertToIntOrThrow } from '../../helpers';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Round } from '../../models/rounds/Round';
import { Submission } from '../../models/rounds/Submission';

const submissionsAdminRouter = new Router();

submissionsAdminRouter.prefix('/api/admin/submissions');
submissionsAdminRouter.use(authenticate);
submissionsAdminRouter.use(isStaff);

submissionsAdminRouter.get('/', async (ctx) => {
    const rounds = await Round.find({
        relations: [
            'matches',
            'matches.submissions',
            'matches.submissions.country',
        ],
    });

    ctx.body = {
        rounds,
    };
});

submissionsAdminRouter.post('/:id/save', async (ctx) => {
    const submissionId = convertToIntOrThrow(ctx.params.id);
    const submission = await Submission.findOneOrFail({ id: submissionId });
    submission.anonymisedAs = ctx.request.body.anonymisedAs?.trim() || null;
    submission.anonymisedLink = ctx.request.body.anonymisedLink?.trim() || null;
    await submission.save();

    ctx.body = {
        success: 'ok',
    };
});

export default submissionsAdminRouter;
