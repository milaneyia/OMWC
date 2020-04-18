import Router from '@koa/router';
import { Brackets } from 'typeorm';
import { Round } from '../models/rounds/Round';
import { Criteria } from '../models/judging/Criteria';

const judgingResultsRouter = new Router();

judgingResultsRouter.prefix('/api/judgingResults');

judgingResultsRouter.get('/', async (ctx) => {
    const rounds = await Round
        .createQueryBuilder('round')
        .leftJoin('round.submissions', 'submissions')
        .leftJoin('submissions.judging', 'judging')
        .leftJoin('judging.judgingCriteria', 'judgingCriteria')
        .leftJoin('submissions.country', 'country')
        .leftJoin('judging.judge', 'judge')
        .where('round.resultsAt < :today', { today: new Date() })
        .andWhere(new Brackets((qb) => {
            qb
                .where('country.isCompeting = true')
                .orWhere('country.eliminationRound is not null');
        }))
        .select(['round', 'submissions', 'country', 'judging', 'judgingCriteria', 'judge.username'])
        .orderBy('round.resultsAt', 'DESC')
        .getMany();

    const criterias = await Criteria.find({});

    return ctx.body = {
        criterias,
        path: '/judgingResults',
        rounds,
    };
});

export default judgingResultsRouter;
