import Router from '@koa/router';
import { Brackets } from 'typeorm';
import { User } from '../models/User';
import { Country } from '../models/Country';
import { Criteria } from '../models/judging/Criteria';

const leaderboardRouter = new Router();

leaderboardRouter.prefix('/api/leaderboard');

leaderboardRouter.get('/', async (ctx) => {
    const countries = await Country
        .createQueryBuilder('country')
        .leftJoin('country.eliminationRound', 'eliminationRound')
        .select(['country.id', 'country.code', 'country.name', 'eliminationRound.title'])
        .where('country.isCompeting = true')
        .orWhere('country.eliminationRound is not null')
        .getMany();

    // const scores = await Country
    //     .createQueryBuilder('country')
    //     .innerJoin('country.submissions', 'submission')
    //     .innerJoin('submission.judging', 'judging')
    //     .innerJoin('judging.round', 'round')
    //     .innerJoin('judging.judgingCriteria', 'criteria')
    //     .select('team.id', 'id')
    //     .addSelect('criteria.name', 'criteriaName')
    //     .addSelect('SUM(judging.score)', 'score')
    //     .groupBy('team.id')
    //     .addGroupBy('criteria.id')
    //     .addGroupBy('criteria.name')
    //     .where('round.resultsAt < :today', { today: new Date() })
    //     .andWhere(new Brackets((qb) => {
    //         qb
    //             .where('team.isCompeting = true')
    //             .orWhere('team.eliminationRound is not null');
    //     }))
    //     .getRawMany();

    // if (scores && scores.length) {
    //     teams.map((t) => {
    //         const rawTeamScores = scores.filter((s) => s.id === t.id);
    //         const criteriaScores: ICriteriaScore[] = rawTeamScores.map((s) => {
    //             return {
    //                 criteria: s.criteriaName,
    //                 score: s.score,
    //             };
    //         });
    //         const finalScore: number = criteriaScores.map((s) => s.score).reduce((total, s) => total + s, 0);
    //         t.criteriaScores = criteriaScores;
    //         t.finalScore = finalScore;
    //     });

    //     teams.sort((a, b) => b.finalScore - a.finalScore);
    // }

    const criterias = await Criteria.find({});

    return ctx.body = {
        criterias,
        path: '/leaderboard',
        countries,
    };
});

export default leaderboardRouter;
