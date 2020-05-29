import Router from '@koa/router';
import path from 'path';
import { Criteria } from '../models/judging/Criteria';
import { Round } from '../models/rounds/Round';
import { findSubmission, download } from '../middlewares/downloadSubmission';
import { Submission } from '../models/rounds/Submission';

const resultsRouter = new Router();

resultsRouter.prefix('/api/results');

resultsRouter.get('/qualifiers', async (ctx) => {
    const qualifier = await Round
        .createQueryBuilder('round')
        .innerJoinAndSelect('round.matches', 'matches')
        .leftJoinAndSelect('matches.submissions', 'submissions', 'round.resultsAt <= :today', { today: new Date() })
        .leftJoinAndSelect('submissions.country', 'country')
        .leftJoinAndSelect('submissions.qualifierJudging', 'qualifierJudging')
        .leftJoinAndSelect('qualifierJudging.judge', 'judge')
        .leftJoinAndSelect('qualifierJudging.qualifierJudgingToCriterias', 'qualifierJudgingToCriterias')
        .leftJoinAndSelect('qualifierJudgingToCriterias.criteria', 'criteria')
        .where('round.isQualifier = true')
        .getOne();

    const criterias = await Criteria.find({});
    const judges = qualifier?.matches?.[0]?.submissions?.[0]?.qualifierJudging?.map(j => j.judge);

    return ctx.body = {
        criterias,
        qualifier,
        judges,
    };
});

resultsRouter.get('/elimination', async (ctx) => {
    const rounds = await Round
        .createQueryBuilder('round')
        .innerJoinAndSelect('round.matches', 'matches')
        .leftJoinAndSelect('matches.teamA', 'teamA')
        .leftJoinAndSelect('matches.teamB', 'teamB')
        .leftJoinAndSelect('matches.submissions', 'submissions', 'round.resultsAt <= :today', { today: new Date() })
        .leftJoinAndSelect('submissions.country', 'sub_country')
        .leftJoinAndSelect('matches.eliminationJudging', 'eliminationJudging', 'round.resultsAt <= :today', { today: new Date() })
        .leftJoinAndSelect('eliminationJudging.judge', 'judge')
        .leftJoinAndSelect('eliminationJudging.submissionChosen', 'submissionChosen')
        .leftJoinAndSelect('submissionChosen.country', 'country')
        .where('round.isQualifier = false')
        .orderBy('round.id', 'ASC')
        .getMany();

    const today = new Date();
    const currentRound = rounds.find(r =>
        new Date(r.submissionsStartedAt) <= today &&
        new Date(r.resultsAt) >= today
    );

    return ctx.body = {
        rounds,
        currentRound,
    };
});

resultsRouter.get('/download/:id', findSubmission, async (ctx, next) => {
    const submission: Submission = ctx.state.submission;

    if (new Date(submission.match.round.resultsAt) > new Date()) {
        return ctx.body = {
            error: 'Unathorized',
        };
    }

    ctx.state.baseDir = path.join(__dirname, '../../osz/originals/');
    ctx.state.downloadPath = submission.originalPath;

    return await next();
}, download);

export default resultsRouter;
