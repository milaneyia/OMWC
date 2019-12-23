import Router from '@koa/router';
import { convertToIntOrThrow } from '../../../helpers';
import { authenticate, isStaff } from '../../../middlewares/authentication';
import { JudgingCriteria } from '../../../models/judging/JudgingCriteria';
import { Round } from '../../../models/rounds/Round';
import { Team } from '../../../models/Team';

interface IFinalScore {
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

    const criterias = await JudgingCriteria.find({});

    const finalScores: IFinalScore[] = [];
    rounds.forEach((r) => {
        r.submissions.forEach((s) => {
            const finalScore = s.judging.map((j) => j.score).reduce((total, score) => total + score, 0);

            finalScores.push({
                finalScore,
                roundId: r.id,
                submissionId: s.id,
            });
        });
    });

    return ctx.render('admin/judging/index', {
        criterias,
        finalScores,
        rounds,
    });
});

judgingAdminRouter.post('/eliminateTeam', async (ctx) => {
    const currentRound = await Round.findCurrentRound();

    if (!currentRound) {
        return ctx.render('error');
    }

    const eliminatedTeamId = convertToIntOrThrow(ctx.request.body.eliminatedTeamId);
    const team = await Team.findOneOrFail({ id: eliminatedTeamId });
    team.isCompeting = false;
    team.eliminationRoundId = currentRound.id;
    team.save();

    return ctx.redirect('back');
});

export default judgingAdminRouter;
