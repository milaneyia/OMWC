import { Not } from 'typeorm';
import { Country } from '../../app/models/Country';
import { Team } from '../../app/models/Team';
import { User } from '../../app/models/User';

export default async function teams() {
    const countries = await Country.find();

    countries.forEach(async (country, i) => {
        const captain = await User.findOne({ countryId: country.id, roleId: 1 });
        let members = [];

        if (captain) {
            members = await User.find({ countryId: country.id, roleId: 1, id: Not(captain.id) });
        } else {
            members = await User.find({ countryId: country.id, roleId: 1 });
        }

        const team = new Team();
        team.id = i + 1;
        team.captainId = (captain && captain.id);
        team.countryId = country.id;
        team.isCompeting = true;
        team.users = members;
        team.save();
    });
}
