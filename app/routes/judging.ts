import Router from '@koa/router';
import { convertToIntOrThrow } from '../helpers';
import { authenticate, isJudge } from '../middlewares/authentication';
import { QualifierJudging } from '../models/judging/QualifierJudging';
import { Round } from '../models/rounds/Round';
import { Submission } from '../models/rounds/Submission';
import { Criteria } from '../models/judging/Criteria';
import { QualifierJudgingToCriteria } from '../models/judging/QualifierJudgingToCriteria';
import { Match } from '../models/rounds/Match';

const judgingRouter = new Router();

judgingRouter.prefix('/api/judging');
judgingRouter.use(authenticate);
judgingRouter.use(isJudge);

judgingRouter.get('/', async (ctx) => {
    const currentRound = await Round.findCurrentJudgingRound();

    if (!currentRound) {
        return ctx.body = {
            error: 'There is currently no round to judge',
        };
    }

    const matches = await Match.findByRoundWithSubmissions(currentRound.id);
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
        // do something
    }

});

judgingRouter.post('/save', async (ctx) => {
    const round: Round = ctx.request.body.round;

    if (!round) {
        return ctx.body = { error: 'fuck' };
    }

    if (round.isQualifier) {
        const submissionId = convertToIntOrThrow(ctx.request.body.submissionId);
        const criteriaId = await convertToIntOrThrow(ctx.request.body.criteriaId);
        const score = convertToIntOrThrow(ctx.request.body.score);
        const comment = ctx.request.body.comment && ctx.request.body.comment.trim();

        const [currentRound, criteria, submission] = await Promise.all([
            Round.findCurrentJudgingRound(),
            Criteria.findOneOrFail({ id: criteriaId }),
            Submission.findOneOrFail({ id: submissionId }),
        ]);

        if (!score || !comment || !criteria || !submission) {
            return ctx.body = { error: 'Missing data' };
        }

        if (!currentRound) {
            return ctx.body = { error: 'There is currently no round to judge' };
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
        }

        if (!judgingToCriteria) {
            judgingToCriteria = new QualifierJudgingToCriteria();
        }

        judging.judgeId = ctx.state.user.id;
        judging.submissionId = submission.id;
        await judging.save();

        judgingToCriteria.criteria = criteria;
        judgingToCriteria.qualifierJudgingId = judging.id;
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
        // do something!!
    }

    ctx.body = { success: 'Saved!' };
});

export default judgingRouter;
