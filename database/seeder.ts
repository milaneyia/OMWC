import { createConnection } from 'typeorm';
import { CaptainApplication } from '../app/models/applications/CaptainApplication';
import { JudgeApplication } from '../app/models/applications/JudgeApplication';
import { MapperApplication } from '../app/models/applications/MapperApplication';
import { CaptainVote } from '../app/models/CaptainVote';
import { Country } from '../app/models/Country';
import { Judging } from '../app/models/judging/Judging';
import { JudgingCriteria } from '../app/models/judging/JudgingCriteria';
import { Role } from '../app/models/Role';
import { Round } from '../app/models/rounds/Round';
import { Submission } from '../app/models/rounds/Submission';
import { Schedule } from '../app/models/Schedule';
import { Team } from '../app/models/Team';
import { User } from '../app/models/User';
import countries from './seeders/countries';
import judgingCriterias from './seeders/judgingcriterias';
import judging from './seeders/judgingSeeder';
import roles from './seeders/roles';
import submissions from './seeders/submissionsSeeder';
import teams from './seeders/teams';
import users from './seeders/users';

// tslint:disable:no-console
async function seed() {
    await createConnection();

    console.log('Deleting current data');
    await User.update({}, { teamId: null });
    await Judging.delete({});
    await Submission.delete({});
    await Team.delete({});
    await Round.delete({});
    await CaptainVote.delete({});
    await CaptainApplication.delete({});
    await MapperApplication.delete({});
    await JudgeApplication.delete({});
    await User.delete({});
    await Role.delete({});
    await Country.delete({});
    await Schedule.delete({});
    await JudgingCriteria.delete({});

    console.log('Seeding');
    await roles();
    await countries();
    await users();
    await teams();
    await judgingCriterias();

    const startDate = new Date();
    const beforeStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() - 1);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 5);

    await Round.insert([
        {
            anonymisedLink: 'somelinkfortheosz',
            id: 1,
            information: 'some extra info',
            judgingEndedAt: beforeStartDate,
            judgingStartedAt: beforeStartDate,
            resultsAt: beforeStartDate,
            submissionsEndedAt: beforeStartDate,
            submissionsStartedAt: beforeStartDate,
            title: 'Round 1',
        },
    ]);

    await submissions();
    await judging();

    await Schedule.insert({
        applicationsStartedAt: startDate,
        captainApplicationsEndedAt: endDate,
        captainVotingEndedAt: endDate,
        captainVotingStartedAt: startDate,
        constestEndedAt: endDate,
        constestStartedAt: startDate,
        judgeApplicationsEndedAt: endDate,
        mapperApplicationsEndedAt: startDate,
        mappersChoiceEndedAt: endDate,
        mappersChoiceStartedAt: startDate,
    });

    console.log('Done, can close now');
}

seed();
