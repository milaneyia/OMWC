import { Judging } from '../../app/models/judging/Judging';
import { JudgingCriteria } from '../../app/models/judging/JudgingCriteria';
import { ROLE } from '../../app/models/Role';
import { Round } from '../../app/models/rounds/Round';
import { User } from '../../app/models/User';

export default async function judging() {
    const judges = await User.find({ roleId: ROLE.Judge });
    const round = await Round.findOne({ relations: ['submissions'] });
    const criterias = await JudgingCriteria.find();

    if (round) {
        judges.forEach((judge) => {
            round.submissions.forEach((submission) => {
                criterias.forEach(async (criteria) => {

                    await Judging.insert([
                        {
                            comment: 'some comment from ' + judge.username,
                            judgeId: judge.id,
                            judgingCriteriaId: criteria.id,
                            roundId: round.id,
                            score: Math.floor((Math.random() * criteria.maxScore) + 1),
                            submissionId: submission.id,
                        },
                    ]);
                });
            });
        });
    }
}
