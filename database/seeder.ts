import { createConnection } from 'typeorm';
import { CaptainApplication } from '../app/models/applications/CaptainApplication';
import { JudgeApplication } from '../app/models/applications/JudgeApplication';
import { MapperApplication } from '../app/models/applications/MapperApplication';
import { CaptainVote } from '../app/models/CaptainVote';
import { Country } from '../app/models/Country';
import { Role } from '../app/models/Role';
import { Schedule } from '../app/models/Schedule';
import { User } from '../app/models/User';
import countries from './seeders/countries';
import roles from './seeders/roles';
import users from './seeders/users';

// tslint:disable:no-console
async function seed() {
    await createConnection();

    console.log('Deleting current data');
    await CaptainVote.delete({});
    await CaptainApplication.delete({});
    await MapperApplication.delete({});
    await JudgeApplication.delete({});
    await User.delete({});
    await Role.delete({});
    await Country.delete({});
    await Schedule.delete({});

    console.log('Seeding');
    await roles();
    await countries();
    await users();
    await Schedule.insert({ applicationsStartedAt: new Date() });

    console.log('Done');
}

seed();
