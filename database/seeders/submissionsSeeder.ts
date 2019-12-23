import { Round } from '../../app/models/rounds/Round';
import { Submission } from '../../app/models/rounds/Submission';
import { Team } from '../../app/models/Team';

export default async function submissions() {
    const teams = await Team.find();
    const round = await Round.findOne();

    teams.forEach(async (team, i) => {
        await Submission.insert([
            {
                anonymisedAs: 'anonymise name ' + i,
                originalLink: 'original link ' + i,
                roundId: round && round.id,
                teamId: team.id,
            },
        ]);
    });
}
