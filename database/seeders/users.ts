import { Country } from '../../app/models/Country';
import { User } from '../../app/models/User';

export default async function users() {
    await User.insert([
        {
            country: await Country.findOne({ code: 'CL' }),
            osuId: 1052994,
            roleId: 4,
            username: 'Milan-',
        },
        {
            country: await Country.findOne({ code: 'US' }),
            osuId: 3178418,
            roleId: 1,
            username: 'pishifat',
        },
    ]);
}
