import Router from '@koa/router';
import koaBody from 'koa-body';
import path from 'path';
import { convertToIntOrThrow, checkFileExistence, saveFile } from '../../helpers';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Round } from '../../models/rounds/Round';
import { Submission } from '../../models/rounds/Submission';
import { findSubmission, download } from '../../middlewares/downloadSubmission';

const baseDir = path.join(__dirname, '../../../osz/');
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

submissionsAdminRouter.post('/:id/save', koaBody({
    multipart: true,
    formidable: {
        multiples: false,
    },
}), async (ctx) => {
    const anonymisedAs = ctx.request.body.anonymisedAs?.trim();

    if (!anonymisedAs) {
        return ctx.body = {
            error: `Type the entry's name`,
        };
    }

    const oszFile = ctx.request.files?.oszFile;

    if (!oszFile || !oszFile.name.endsWith('.osz')) {
        return ctx.body = {
            error: 'Select an .osz file',
        };
    }

    const submissionId = convertToIntOrThrow(ctx.params.id);
    const submission = await Submission.findOneOrFail({
        where: {
            id: submissionId,
        },
        relations: [
            'match',
            'match.round',
        ],
    });
    const finalDir = path.join(baseDir, submission.match.round.title);
    const fileName = `${anonymisedAs}.osz`;
    const finalPath = path.join(finalDir, fileName);
    const anonymisedPath = path.join(submission.match.round.title, fileName);

    if (oszFile) {
        await saveFile(oszFile.path, finalDir, finalPath);
    }

    await checkFileExistence(finalPath);

    submission.anonymisedAs = anonymisedAs;
    submission.anonymisedPath = anonymisedPath;
    await submission.save();

    ctx.body = {
        success: 'ok',
    };
});

submissionsAdminRouter.get('/:id/download', findSubmission, async (ctx, next) => {
    const submission: Submission = ctx.state.submission;

    ctx.state.baseDir = baseDir;
    ctx.state.downloadPath = submission.originalPath;

    return await next();
}, download);

submissionsAdminRouter.get('/:id/downloadAnom', findSubmission, async (ctx, next) => {
    const submission: Submission = ctx.state.submission;

    ctx.state.baseDir = baseDir;
    ctx.state.downloadPath = submission.anonymisedPath;

    return await next();
}, download);

export default submissionsAdminRouter;
