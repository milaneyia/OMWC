import Router from '@koa/router';
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
        where: {
            judgeId: ctx.state.user.id,
            roundId: currentRound.id,
        },
    });

    return ctx.render('judging/index', {
        criterias,
        currentRound,
        judgingDone,
    });
});

judgingRouter.post('/save', async (ctx) => {
    const submission = await Submission.findOneOrFail({ where: { id: ctx.request.body.submissionId } });
    const criteria = await JudgingCriteria.findOneOrFail({ where: { id: ctx.request.body.criteriaId } });
    const round = await Round.findCurrentJudgingRound();
    const score = ctx.request.body.score;
    const comment = ctx.request.body.comment;

    if (!round || !score || !comment) {
        return ctx.body = { error: 'Missing data' };
    }

    if (score > criteria.maxScore) {
        return ctx.body = { error: 'Score is higher than expected' };
    }

    let judging = await Judging.findOne({
        where: {
            judgeId: ctx.state.user.id,
            judgingCriteriaId: criteria.id,
            roundId: round.id,
            submissionId: submission.id,
        },
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
