import { Country } from '../../app/models/Country';
import { User } from '../../app/models/User';

function randomInt(maxLength: number) {
    return Math.floor((Math.random() * maxLength) + 1);
}

function randomString() {
    return Math.random().toString(36).substring(7);
 }

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
        {
            country: await Country.findOne({ id: randomInt(3) }),
            osuId: randomInt(1000000),
            roleId: 1,
            username: randomString(),
        },
        {
            country: await Country.findOne({ id: randomInt(3) }),
            osuId: randomInt(1000000),
            roleId: 1,
            username: randomString(),
        },
        {
            country: await Country.findOne({ id: randomInt(3) }),
            osuId: randomInt(1000000),
            roleId: 1,
            username: randomString(),
        },
        {
            country: await Country.findOne({ id: randomInt(3) }),
            osuId: randomInt(1000000),
            roleId: 1,
            username: randomString(),
        },
        {
            country: await Country.findOne({ id: randomInt(3) }),
            osuId: randomInt(1000000),
            roleId: 1,
            username: randomString(),
        },
        {
            country: await Country.findOne({ id: randomInt(3) }),
            osuId: randomInt(1000000),
            roleId: 1,
            username: randomString(),
        },
        {
            country: await Country.findOne({ id: randomInt(3) }),
            osuId: randomInt(1000000),
            roleId: 1,
            username: randomString(),
        },
        {
            country: await Country.findOne({ id: randomInt(3) }),
            osuId: randomInt(1000000),
            roleId: 1,
            username: randomString(),
        },
        {
            country: await Country.findOne({ id: randomInt(3) }),
            osuId: randomInt(1000000),
            roleId: 1,
            username: randomString(),
        },
        {
            country: await Country.findOne({ id: randomInt(3) }),
            osuId: randomInt(1000000),
            roleId: 1,
            username: randomString(),
        },
    ]);
}
