import Router from '@koa/router';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Round } from '../../models/rounds/Round';
import { Submission } from '../../models/rounds/Submission';

const submissionsAdminRouter = new Router();

submissionsAdminRouter.prefix('/admin/manageSubmissions');
submissionsAdminRouter.use(authenticate);
submissionsAdminRouter.use(isStaff);

submissionsAdminRouter.get('/', async (ctx) => {
    const rounds = await Round.find({ relations: ['submissions', 'submissions.team', 'submissions.team.country'] });
    const currentRound = await Round.findCurrentRound();

    return ctx.render('admin/submissions/index', {
        currentRound,
        rounds,
        user: ctx.state.user,
    });
});

submissionsAdminRouter.get('/edit/:id', async (ctx) => {
    const submission = await Submission.findOneOrFail({ where: { id: ctx.params.id } });

    return ctx.render('admin/submissions/manage', {
        submission,
    });
});

submissionsAdminRouter.post('/save', async (ctx) => {
    const submission = await Submission.findOneOrFail({ where: { id: ctx.request.body.submissionId } });

    if (!ctx.request.body.originalLink) {
        return ctx.render('error');
    }

    submission.originalLink = ctx.request.body.originalLink.trim();
    submission.anonymisedLink = ctx.request.body.anonymisedLink && ctx.request.body.anonymisedLink.trim() || null;
    await submission.save();

    return ctx.redirect('/admin/manageSubmissions');
});

export default submissionsAdminRouter;
