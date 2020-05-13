import Router from '@koa/router';
import { LessThanOrEqual } from 'typeorm';
import path from 'path';
import { Criteria } from '../models/judging/Criteria';
import { Round } from '../models/rounds/Round';
import { findSubmission, download } from '../middlewares/downloadSubmission';
import { Submission } from '../models/rounds/Submission';

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
    const judges = round?.matches[0]?.submissions[0]?.qualifierJudging?.map(j => j.judge);

    return ctx.body = {
        criterias,
        round,
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

    ctx.state.baseDir = path.join(__dirname, '../../osz/originals/');
    ctx.state.downloadPath = submission.originalPath;

    return await next();
}, download);

export default resultsRouter;
