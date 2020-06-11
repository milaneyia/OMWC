import Router from '@koa/router';
import { convertToIntOrThrow } from '../helpers';
import { authenticate, isJudge } from '../middlewares/authentication';
import { findSubmission, download } from '../middlewares/downloadSubmission';
import { QualifierJudging } from '../models/judging/QualifierJudging';
import { Round } from '../models/rounds/Round';
import { Submission } from '../models/rounds/Submission';
import { Criteria } from '../models/judging/Criteria';
import { QualifierJudgingToCriteria } from '../models/judging/QualifierJudgingToCriteria';
import { Match } from '../models/rounds/Match';
import { ParameterizedContext, Next } from 'koa';
import path from 'path';

const judgingRouter = new Router();

judgingRouter.prefix('/api/judging');
judgingRouter.use(authenticate);
judgingRouter.use(isJudge);
judgingRouter.use(async (ctx: ParameterizedContext, next: Next) => {
    const currentRound = await Round.findCurrentJudgingRound();

    if (!currentRound) {
        return ctx.body = { error: 'There is currently no round to judge' };
    }

    ctx.state.currentRound = currentRound;
    await next();
});

judgingRouter.get('/', async (ctx) => {
    const currentRound = ctx.state.currentRound;
    const matches = await Match.createQueryBuilder('match')
        .leftJoin('match.round', 'round')
        .leftJoin('match.submissions', 'submissions')
        .select([
            'match.id',
            'submissions.id',
            'submissions.anonymisedAs',
            'submissions.anonymisedPath',
        ])
        .where('round.id = :roundId', { roundId: currentRound.id })
        .orderBy('RAND()')
        .getMany();

    for (const match of matches) {
        match.submissions.sort((a, b) => {
            const anomA = a.anonymisedAs?.toUpperCase();
            const anomB = b.anonymisedAs?.toUpperCase();

            if (anomA < anomB) return -1;
            if (anomA > anomB) return 1;

            return 0;
        });
    }

    currentRound.matches = matches;

    if (currentRound.isQualifier) {
        const [criterias, judgingDone] = await Promise.all([
            Criteria.find({}),
            QualifierJudging.find({
                where: { judgeId: ctx.state.user.id },
                relations: ['qualifierJudgingToCriterias'],
            }),
        ]);

        return ctx.body = {
            currentRound,
            criterias,
            judgingDone,
        };

    } else {
        return ctx.body = { error: 'soon tm' };
    }

});

judgingRouter.post('/save', async (ctx) => {

    if (ctx.state.currentRound.isQualifier) {
        const submissionId = convertToIntOrThrow(ctx.request.body.submissionId);
        const criteriaId = convertToIntOrThrow(ctx.request.body.criteriaId);
        const score = convertToIntOrThrow(ctx.request.body.score);
        const comment = ctx.request.body.comment && ctx.request.body.comment.trim();

        const [criteria, submission] = await Promise.all([
            Criteria.findOneOrFail({ id: criteriaId }),
            Submission.findOneOrFail({
                where: { id: submissionId },
                relations: ['match'],
            }),
        ]);

        if (!comment || !criteria || !submission) {
            return ctx.body = { error: 'Missing data' };
        }

        if (submission.match.roundId !== ctx.state.currentRound.id) {
            return ctx.body = { error: 'woah' };
        }

        if (score > criteria.maxScore) {
            return ctx.body = { error: 'Score is higher than expected' };
        }

        let judging = await QualifierJudging.findOne({
            judgeId: ctx.state.user.id,
            submissionId: submission.id,
        });

        let judgingToCriteria;

        if (judging) {
            judgingToCriteria = await QualifierJudgingToCriteria.findOne({
                criteria,
                qualifierJudgingId: judging.id,
            });
        } else {
            judging = new QualifierJudging();
            judging.judgeId = ctx.state.user.id;
            judging.submissionId = submission.id;
            await judging.save();
        }

        if (!judgingToCriteria) {
            judgingToCriteria = new QualifierJudgingToCriteria();
            judgingToCriteria.criteria = criteria;
            judgingToCriteria.qualifierJudgingId = judging.id;
        }

        judgingToCriteria.score = score;
        judgingToCriteria.comment = comment;
        await judgingToCriteria.save();

        const judgingDone = await QualifierJudging.find({
            where: { judgeId: ctx.state.user.id },
            relations: ['qualifierJudgingToCriterias'],
        });

        return ctx.body = {
            judgingDone,
            success: 'Saved!',
        };

    } else {
        return ctx.body = { error: 'nope' };
    }
});

judgingRouter.get('/submission/:id/download', findSubmission, async (ctx, next) => {
    const submission: Submission = ctx.state.submission;
    const baseDir = path.join(__dirname, '../../osz/');

    if (ctx.state.currentRound.id !== ctx.state.submission.match.roundId) {
        return ctx.body = {
            error: 'oops',
        };
    }

    ctx.state.baseDir = baseDir;
    ctx.state.downloadPath = submission.anonymisedPath;

    return await next();
}, download);

export default judgingRouter;
