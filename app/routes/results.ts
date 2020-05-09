import Router from '@koa/router';
import { LessThanOrEqual } from 'typeorm';
import { Criteria } from '../models/judging/Criteria';
import { Round } from '../models/rounds/Round';
import { User } from '../models/User';
import { ROLE } from '../models/Role';

const resultsRouter = new Router();

resultsRouter.prefix('/api/results');

resultsRouter.get('/qualifiers', async (ctx) => {
    const round = await Round.findOne({
        where: {
            isQualifier: true,
            resultsAt: LessThanOrEqual(new Date()),
        },
        relations: [
            'matches',
            'matches.submissions',
            'matches.submissions.country',
            'matches.submissions.qualifierJudging',
            'matches.submissions.qualifierJudging.judge',
            'matches.submissions.qualifierJudging.qualifierJudgingToCriterias',
            'matches.submissions.qualifierJudging.qualifierJudgingToCriterias.criteria',
        ],
    });

    const criterias = await Criteria.find({});
    const judges = await User.find({ roleId: ROLE.Judge });

    return ctx.body = {
        criterias,
        round,
        judges,
    };
});

export default resultsRouter;
