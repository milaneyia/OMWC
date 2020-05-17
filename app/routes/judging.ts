import Router from '@koa/router';
import { convertToIntOrThrow } from '../helpers';
import { authenticate, isJudge } from '../middlewares/authentication';
import { QualifierJudging } from '../models/judging/QualifierJudging';
import { Round } from '../models/rounds/Round';
import { Submission } from '../models/rounds/Submission';
import { Criteria } from '../models/judging/Criteria';
import { QualifierJudgingToCriteria } from '../models/judging/QualifierJudgingToCriteria';

const judgingRouter = new Router();

judgingRouter.prefix('/api/judging');
judgingRouter.use(authenticate);
judgingRouter.use(isJudge);

judgingRouter.get('/', async (ctx) => {
    // const today = new Date();
    // const currentRound = await Round
    //     .createQueryBuilder('round')
    //     .leftJoinAndSelect('round.submissions', 'submission')
    //     .where('judgingStartedAt <= :today', { today })
    //     .andWhere('judgingEndedAt >= :today', { today })
    //     .andWhere('submission.anonymisedAs IS NOT NULL')
    //     .select(['round', 'submission.id', 'submission.anonymisedAs'])
    //     .getOne();

    // if (!currentRound) {
    //     return ctx.body = {
    //         error: 'Not a round in progress',
    //     };
    // }

    // const criterias = await Criteria.find({});
    // const judgingDone = await QualifierJudging.find({
    //     judgeId: ctx.state.user.id,
    //     roundId: currentRound.id,
    // });

    // ctx.body = {
    //     criterias,
    //     currentRound,
    //     judgingDone,
    // };
});

judgingRouter.post('/save', async (ctx) => {
    // const submissionId = convertToIntOrThrow(ctx.request.body.submissionId);
    // const criteriaId = convertToIntOrThrow(ctx.request.body.criteriaId);
    // const score = convertToFloat(ctx.request.body.score);
    // const comment = ctx.request.body.comment && ctx.request.body.comment.trim();

    // const submission = await Submission.findOneOrFail({ id: submissionId });
    // const criteria = await Criteria.findOneOrFail({ id: criteriaId });
    // const round = await Round.findCurrentJudgingRound();

    // if (!round || !score || !comment) {
    //     return ctx.body = { error: 'Missing data' };
    // }

    // if (score > criteria.maxScore) {
    //     return ctx.body = { error: 'Score is higher than expected' };
    // }

    // let judging = await QualifierJudging.findOne({
    //     judgeId: ctx.state.user.id,
    //     roundId: round.id,
    //     submissionId: submission.id,
    // });
    // let judgingToCriteria;

    // if (judging) {
    //     judgingToCriteria = await QualifierJudgingToCriteria.findOne({
    //         criteria,
    //         judging,
    //     });
    // } else {
    //     judging = new QualifierJudging();
    // }

    // if (!judging || !judgingToCriteria) {
    //     judgingToCriteria = new QualifierJudgingToCriteria();
    // }

    // judging.judgeId = ctx.state.user.id;
    // judging.roundId = round.id;
    // judging.submissionId = submission.id;
    // judging.comment = comment;
    // await judging.save();

    // judgingToCriteria.criteria = criteria;
    // judgingToCriteria.judging = judging;
    // judgingToCriteria.score = score;
    // await judgingToCriteria.save();

    // return ctx.body = {
    //     judging,
    //     success: 'Saved',
    // };
});

export default judgingRouter;
