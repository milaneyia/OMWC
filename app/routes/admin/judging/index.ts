import Router from '@koa/router';
import { authenticate, isStaff } from '../../../middlewares/authentication';
import { JudgingCriteria } from '../../../models/judging/JudgingCriteria';
import { ROLE } from '../../../models/Role';
import { Round } from '../../../models/rounds/Round';
import { Team } from '../../../models/Team';
import { User } from '../../../models/User';

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
    const rounds = await Round.find({ relations: [
        'submissions',
        'submissions.team',
        'submissions.team.country',
        'submissions.judging',
        'submissions.judging.judge',
        'submissions.judging.judgingCriteria',
    ]});

    const criterias = await JudgingCriteria.find({});
    const judges = await User.find({ where: { roleId: ROLE.Judge } });

    const finalScores: IFinalScore[] = [];
    rounds.forEach((r) => {
        r.submissions.forEach((s) => {
            const scores = s.judging.map((j) => {
                if (judges.find((judge) => judge.id === j.judgeId)) {
                    return j.score;
                }

                return 0;
            });

            const finalScore = scores.reduce((total, score) => total + score);

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
        judges,
        rounds,
    });
});

judgingAdminRouter.post('/eliminateTeam', async (ctx) => {
    const currentRound = await Round.findCurrentRound();

    if (!currentRound || !ctx.request.body.eliminatedTeamId) {
        return ctx.render('error');
    }

    const team = await Team.findOneOrFail({ id: ctx.request.body.eliminatedTeamId });
    team.isCompeting = false;
    team.eliminationRoundId = currentRound.id;
    team.save();

    return ctx.redirect('back');
});

export default judgingAdminRouter;
