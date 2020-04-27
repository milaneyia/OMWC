import Router from '@koa/router';
import { MoreThanOrEqual } from 'typeorm';
import { Criteria } from '../models/judging/Criteria';
import { Round } from '../models/rounds/Round';

const leaderboardRouter = new Router();

leaderboardRouter.prefix('/api/results');

leaderboardRouter.get('/qualifiers', async (ctx) => {
    const round = await Round.findOne({
        where: {
            isQualifier: true,
            resultsAt: MoreThanOrEqual(new Date()),
        },
        relations: [
            'matches',
            'matches.submissions',
            'matches.submissions.qualifierJudging',
            'matches.submissions.qualifierJudging.qualifierJudgingToCriterias',
        ],
    });

    // let submissions: Submission = [];

    // if (round?.matches.length) {
    //     submissions = round.matches[0].submissions;
    // }

    // const countries = await Country
    //     .createQueryBuilder('country')
    //     .leftJoin('country.eliminationRound', 'eliminationRound')
    //     .select(['country.id', 'country.code', 'country.name', 'eliminationRound.title'])
    //     .where('country.wasConfirmed = true')
    //     .orWhere('country.eliminationRound is not null')
    //     .getMany();

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
    //             .where('team.wasConfirmed = true')
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
        round,
    };
});

export default leaderboardRouter;
