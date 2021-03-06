import Router from '@koa/router';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Round } from '../../models/rounds/Round';

const judgingAdminRouter = new Router();

judgingAdminRouter.prefix('/api/admin/judging');
judgingAdminRouter.use(authenticate);
judgingAdminRouter.use(isStaff);

judgingAdminRouter.get('/', async (ctx) => {
    const rounds = await Round.find({
        order: {
            judgingEndedAt: 'DESC',
        },
        relations: [
            'matches',
            'matches.teamA',
            'matches.teamB',
            'matches.eliminationJudging',
            'matches.eliminationJudging.submissionChosen',
            'matches.eliminationJudging.submissionChosen.country',
            'matches.eliminationJudging.judge',
            'matches.submissions',
            'matches.submissions.country',
            'matches.submissions.qualifierJudging',
            'matches.submissions.qualifierJudging.judge',
            'matches.submissions.qualifierJudging.qualifierJudgingToCriterias',
            'matches.submissions.qualifierJudging.qualifierJudgingToCriterias.criteria',
            'matches.submissions.eliminationJudging',
            'matches.submissions.eliminationJudging.judge',
        ],
    });

    ctx.body = {
        rounds,
    };
});

export default judgingAdminRouter;
