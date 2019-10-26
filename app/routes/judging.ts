import Router from '@koa/router';
import { convertToFloat, convertToInt, convertToIntOrThrow } from '../helpers';
import { authenticate, isJudge } from '../middlewares/authentication';
import { Judging } from '../models/judging/Judging';
import { JudgingCriteria } from '../models/judging/JudgingCriteria';
import { Round } from '../models/rounds/Round';
import { Submission } from '../models/rounds/Submission';

const judgingRouter = new Router();

judgingRouter.prefix('/judging');
judgingRouter.use(authenticate);
judgingRouter.use(isJudge);

judgingRouter.get('/', async (ctx) => {
    const today = new Date();
    const currentRound = await Round
        .createQueryBuilder('round')
        .leftJoinAndSelect('round.submissions', 'submission')
        .where('judgingStartedAt <= :today', { today })
        .andWhere('judgingEndedAt >= :today', { today })
        .andWhere('submission.anonymisedAs IS NOT NULL')
        .select(['round', 'submission.id', 'submission.anonymisedAs'])
        .getOne();

    if (!currentRound) {
        return ctx.render('error');
    }

    const criterias = await JudgingCriteria.find({});
    const judgingDone = await Judging.find({
        judgeId: ctx.state.user.id,
        roundId: currentRound.id,
    });

    return ctx.render('judging/index', {
        criterias,
        currentRound,
        judgingDone,
    });
});

judgingRouter.post('/save', async (ctx) => {
    const submissionId = convertToIntOrThrow(ctx.request.body.submissionId);
    const criteriaId = convertToIntOrThrow(ctx.request.body.criteriaId);
    const score = convertToFloat(ctx.request.body.score);
    const comment = ctx.request.body.comment && ctx.request.body.comment.trim();

    const submission = await Submission.findOneOrFail({ id: submissionId });
    const criteria = await JudgingCriteria.findOneOrFail({ id: criteriaId });
    const round = await Round.findCurrentJudgingRound();

    if (!round || !score || !comment) {
        return ctx.body = { error: 'Missing data' };
    }

    if (score > criteria.maxScore) {
        return ctx.body = { error: 'Score is higher than expected' };
    }

    let judging = await Judging.findOne({
        judgeId: ctx.state.user.id,
        judgingCriteriaId: criteria.id,
        roundId: round.id,
        submissionId: submission.id,
    });

    if (!judging) {
        judging = new Judging();
    }

    judging.judgeId = ctx.state.user.id;
    judging.judgingCriteriaId = criteria.id;
    judging.roundId = round.id;
    judging.submissionId = submission.id;
    judging.score = score;
    judging.comment = comment;
    await judging.save();

    return ctx.body = {
        judging,
        success: 'Saved',
    };
});

export default judgingRouter;
