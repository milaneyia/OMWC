import Router from '@koa/router';
import { convertToIntOrThrow } from '../../helpers';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Round } from '../../models/rounds/Round';
import { Criteria } from '../../models/judging/Criteria';
import { Country } from '../../models/Country';

interface FinalScore {
    finalScore: number;
    roundId: number;
    submissionId: number;
}

const judgingAdminRouter = new Router();

judgingAdminRouter.prefix('/admin/judging');
judgingAdminRouter.use(authenticate);
judgingAdminRouter.use(isStaff);

judgingAdminRouter.get('/', async (ctx) => {
    const rounds = await Round.find({
        order: {
            judgingEndedAt: 'DESC',
        },
        relations: [
            'submissions',
            'submissions.team',
            'submissions.team.country',
            'submissions.judging',
            'submissions.judging.judge',
            'submissions.judging.judgingCriteria',
        ],
    });

    const criterias = await Criteria.find({});

    const finalScores: FinalScore[] = [];
    // rounds.forEach((r) => {
    //     r.submissions.forEach((s) => {
    //         const finalScore = s.judging.map((j) => j.score).reduce((total, score) => total + score, 0);

    //         finalScores.push({
    //             finalScore,
    //             roundId: r.id,
    //             submissionId: s.id,
    //         });
    //     });
    // });

    ctx.body = {
        criterias,
        finalScores,
        rounds,
    };
});

judgingAdminRouter.post('/eliminateTeam', async (ctx) => {
    const currentRound = await Round.findCurrentRound();

    if (!currentRound) {
        return ctx.body = {
            error: 'Not a valid round',
        };
    }

    const eliminatedTeamId = convertToIntOrThrow(ctx.request.body.eliminatedTeamId);
    const team = await Country.findOneOrFail({ id: eliminatedTeamId });
    team.eliminationRound = currentRound;
    await team.save();

    ctx.body = {
        success: 'ok',
    };
});

export default judgingAdminRouter;
