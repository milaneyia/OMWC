import Router from '@koa/router';
import { Team } from '../models/Team';

const leaderboardRouter = new Router();

leaderboardRouter.prefix('/leaderboard');

leaderboardRouter.get('/', async (ctx) => {
    const teams = await Team
        .createQueryBuilder('team')
        .innerJoin('team.country', 'country')
        .leftJoin('team.eliminationRound', 'eliminationRound')
        .select(['team.id', 'country.id', 'country.name', 'eliminationRound.title'])
        .getMany();

    const scores = await Team
        .createQueryBuilder('team')
        .innerJoin('team.submissions', 'submission')
        .innerJoin('submission.judging', 'judging')
        .select('team.id', 'id')
        .addSelect('SUM(judging.score)', 'score')
        .groupBy('team.id')
        .getRawMany();

    teams.map((t) => {
        const score = scores.find((s) => s.id === t.id);
        t.score = score && score.score;
    });

    return await ctx.render('leaderboard', {
        teams,
    });
});

export default leaderboardRouter;
