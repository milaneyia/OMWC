import Router from '@koa/router';
import { LessThan } from 'typeorm';
import { JudgingCriteria } from '../models/judging/JudgingCriteria';
import { Round } from '../models/rounds/Round';

const judgingResultsRouter = new Router();

judgingResultsRouter.prefix('/judgingResults');

judgingResultsRouter.get('/', async (ctx) => {
    const rounds = await Round.find({
        order: {
            resultsAt: 'DESC',
        },
        relations: [
            'submissions',
            'submissions.team',
            'submissions.team.country',
            'submissions.judging',
            'submissions.judging.judgingCriteria',
            'submissions.judging.judge',
        ],
        where: { resultsAt: LessThan(new Date()) },
    });

    const criterias = await JudgingCriteria.find({});

    return await ctx.render('judgingResults', {
        criterias,
        path: '/judgingResults',
        rounds,
    });
});

export default judgingResultsRouter;
