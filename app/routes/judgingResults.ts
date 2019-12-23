import Router from '@koa/router';
import { Brackets } from 'typeorm';
import { JudgingCriteria } from '../models/judging/JudgingCriteria';
import { Round } from '../models/rounds/Round';
import { User } from '../models/User';

const judgingResultsRouter = new Router();

judgingResultsRouter.prefix('/judgingResults');

judgingResultsRouter.get('/', async (ctx) => {
    const rounds = await Round
        .createQueryBuilder('round')
        .leftJoin('round.submissions', 'submissions')
        .leftJoin('submissions.team', 'team')
        .leftJoin('submissions.judging', 'judging')
        .leftJoin('judging.judgingCriteria', 'judgingCriteria')
        .leftJoin('team.country', 'country')
        .leftJoin('judging.judge', 'judge')
        .where('round.resultsAt < :today', { today: new Date() })
        .andWhere(new Brackets((qb) => {
            qb
                .where('team.isCompeting = true')
                .orWhere('team.eliminationRound is not null');
        }))
        .select(['round', 'submissions', 'team', 'country', 'judging', 'judgingCriteria', 'judge.username'])
        .orderBy('round.resultsAt', 'DESC')
        .getMany();

    const criterias = await JudgingCriteria.find({});

    const osuId = ctx.session.osuId;
    let user;

    if (osuId) {
        user = await User.findOne({ osuId });
    }

    return await ctx.render('judgingResults', {
        criterias,
        path: '/judgingResults',
        rounds,
        user,
    });
});

export default judgingResultsRouter;
