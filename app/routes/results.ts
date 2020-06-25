import Router from '@koa/router';
import { ParameterizedContext } from 'koa';
import path from 'path';
import { Criteria } from '../models/judging/Criteria';
import { Round } from '../models/rounds/Round';
import { User } from '../models/User';
import { findSubmission, download } from '../middlewares/downloadSubmission';
import { Submission } from '../models/rounds/Submission';
import { calculateQualifierScores, convertToIntOrThrow } from '../helpers';
import { ROLE } from '../models/Role';

const resultsRouter = new Router();

resultsRouter.prefix('/api/results');

resultsRouter.get('/qualifiers', async (ctx: ParameterizedContext) => {
    const query = Round
        .createQueryBuilder('round')
        .innerJoinAndSelect('round.matches', 'matches');

    let user;

    if (ctx.session.osuId) {
        user = await User.findOne({
            where: {
                osuId: ctx.session.osuId,
                roleId: ROLE.Staff,
            },
        });
    }

    if (user) {
        query.leftJoinAndSelect('matches.submissions', 'submissions');
    } else {
        query.leftJoinAndSelect('matches.submissions', 'submissions', 'round.resultsAt <= :today', { today: new Date() });
    }

    const qualifier = await query
        .leftJoinAndSelect('submissions.country', 'country')
        .leftJoinAndSelect('submissions.qualifierJudging', 'qualifierJudging')
        .leftJoinAndSelect('qualifierJudging.judge', 'judge')
        .leftJoinAndSelect('qualifierJudging.qualifierJudgingToCriterias', 'qualifierJudgingToCriterias')
        .leftJoinAndSelect('qualifierJudgingToCriterias.criteria', 'criteria')
        .where('round.isQualifier = true')
        .getOne();

    const criterias = await Criteria.find({});
    const judges = qualifier?.matches?.[0]?.submissions?.[0]?.qualifierJudging?.map(j => j.judge);
    const { teamsScores, judgesCorrel } = await calculateQualifierScores(qualifier);

    return ctx.body = {
        criterias,
        qualifier,
        judges,
        teamsScores,
        judgesCorrel,
    };
});

resultsRouter.get('/elimination', async (ctx: ParameterizedContext) => {
    const query = Round
        .createQueryBuilder('round')
        .innerJoinAndSelect('round.matches', 'matches')
        .leftJoinAndSelect('matches.teamA', 'teamA')
        .leftJoinAndSelect('matches.teamB', 'teamB');

    let user;

    if (ctx.session.osuId) {
        user = await User.findOne({
            where: {
                osuId: ctx.session.osuId,
                roleId: ROLE.Staff,
            },
        });
    }

    if (user) {
        query.leftJoinAndSelect('matches.submissions', 'submissions')
            .leftJoinAndSelect('submissions.country', 'sub_country')
            .leftJoinAndSelect('matches.eliminationJudging', 'eliminationJudging');
    } else {
        query.leftJoinAndSelect('matches.submissions', 'submissions', 'round.resultsAt <= :today', { today: new Date() })
            .leftJoinAndSelect('submissions.country', 'sub_country')
            .leftJoinAndSelect('matches.eliminationJudging', 'eliminationJudging', 'round.resultsAt <= :today', { today: new Date() });
    }

    const rounds = await query.leftJoinAndSelect('eliminationJudging.judge', 'judge')
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

resultsRouter.get('/download/:id', findSubmission, async (ctx: ParameterizedContext, next) => {
    const submission: Submission = ctx.state.submission;

    let user;

    if (ctx.session.osuId) {
        user = await User.findOne({
            where: {
                osuId: ctx.session.osuId,
                roleId: ROLE.Staff,
            },
        });
    }

    if (new Date(submission.match.round.resultsAt) > new Date() && !user) {
        return ctx.body = {
            error: 'Unauthorized',
        };
    }

    ctx.state.baseDir = path.join(__dirname, '../../osz/originals/');
    ctx.state.downloadPath = submission.originalPath;

    return await next();
}, download);

resultsRouter.get('/downloadZip/:id', async (ctx: ParameterizedContext, next) => {
    const id = convertToIntOrThrow(ctx.params.id);
    const round = await Round.findOneOrFail({
        id,
    });

    if (new Date(round.resultsAt) > new Date()) {
        return ctx.body = {
            error: 'Unauthorized',
        };
    }

    ctx.state.baseDir = path.join(__dirname, '../../osz/zips/originals');
    ctx.state.downloadPath = `${round.title}.zip`;

    return await next();
}, download);

export default resultsRouter;
