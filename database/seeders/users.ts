import { Country } from '../../app/models/Country';
import { User } from '../../app/models/User';

function randomInt(maxLength: number) {
    return Math.floor((Math.random() * maxLength) + 1);
}

function randomString() {
    return Math.random().toString(36).substring(7);
}

async function generateUsers(length: number, roleId: number): Promise<object[]> {
    const generatedUsers = [];

    for (let i = 0; i < length; i++) {
        const country = await Country.findOne({ id: randomInt(6) });
        generatedUsers.push({
            countryId: country && country.id,
            osuId: randomInt(1000000),
            roleId,
            username: randomString(),
        });
    }

    return generatedUsers;
}

export default async function users() {
    let generatedUsers = await generateUsers(50, 1);
    generatedUsers = generatedUsers.concat(await generateUsers(4, 3));
    generatedUsers.push({
        country: await Country.findOne({ code: 'CL' }),
        osuId: 1052994,
        roleId: 4,
        username: 'Milan-',
    });

    await User.insert(generatedUsers);
}
