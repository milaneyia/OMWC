import Router from '@koa/router';
import { Brackets } from 'typeorm';
import { JudgingCriteria } from '../models/judging/JudgingCriteria';
import { ICriteriaScore, Team } from '../models/Team';
import { User } from '../models/User';

const leaderboardRouter = new Router();

leaderboardRouter.prefix('/leaderboard');

leaderboardRouter.get('/', async (ctx) => {
    const teams = await Team
        .createQueryBuilder('team')
        .innerJoin('team.country', 'country')
        .leftJoin('team.eliminationRound', 'eliminationRound')
        .select(['team.id', 'country.id', 'country.code', 'country.name', 'eliminationRound.title'])
        .where('team.isCompeting = true')
        .orWhere('team.eliminationRound is not null')
        .getMany();

    const scores = await Team
        .createQueryBuilder('team')
        .innerJoin('team.submissions', 'submission')
        .innerJoin('submission.judging', 'judging')
        .innerJoin('judging.round', 'round')
        .innerJoin('judging.judgingCriteria', 'criteria')
        .select('team.id', 'id')
        .addSelect('criteria.name', 'criteriaName')
        .addSelect('SUM(judging.score)', 'score')
        .groupBy('team.id')
        .addGroupBy('criteria.id')
        .addGroupBy('criteria.name')
        .where('round.resultsAt < :today', { today: new Date() })
        .andWhere(new Brackets((qb) => {
            qb
                .where('team.isCompeting = true')
                .orWhere('team.eliminationRound is not null');
        }))
        .getRawMany();

    if (scores && scores.length) {
        teams.map((t) => {
            const rawTeamScores = scores.filter((s) => s.id === t.id);
            const criteriaScores: ICriteriaScore[] = rawTeamScores.map((s) => {
                return {
                    criteria: s.criteriaName,
                    score: s.score,
                };
            });
            const finalScore: number = criteriaScores.map((s) => s.score).reduce((total, s) => total + s, 0);
            t.criteriaScores = criteriaScores;
            t.finalScore = finalScore;
        });

        teams.sort((a, b) => b.finalScore - a.finalScore);
    }

    const criterias = await JudgingCriteria.find({});

    const osuId = ctx.session.osuId;
    let user;

    if (osuId) {
        user = await User.findOne({ osuId });
    }

    return await ctx.render('leaderboard', {
        criterias,
        path: '/leaderboard',
        teams,
        user,
    });
});

export default leaderboardRouter;
