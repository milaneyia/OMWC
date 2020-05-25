import Router from '@koa/router';
import { convertToArray } from '../../helpers';
import { authenticate, isCaptain } from '../../middlewares/authentication';
import { onGoingMappersChoice } from '../../middlewares/scheduleCheck';
import { MapperApplication } from '../../models/applications/MapperApplication';
import { User } from '../../models/User';
import { Country } from '../../models/Country';
import { ROLE } from '../../models/Role';
import { Log, LOG_TYPE } from '../../models/Log';

const mappersChoiceRouter = new Router();

mappersChoiceRouter.prefix('/api/applications/mappersChoice');
mappersChoiceRouter.use(authenticate);
mappersChoiceRouter.use(onGoingMappersChoice);
mappersChoiceRouter.use(isCaptain);

mappersChoiceRouter.get('/', async (ctx) => {
    const applications = await MapperApplication
        .createQueryBuilder('mapperApplication')
        .innerJoinAndSelect('mapperApplication.user', 'user')
        .innerJoin('user.country', 'country')
        .where('country.id = :country', { country: ctx.state.user.country.id })
        .andWhere('user.id != :userId', { userId: ctx.state.user.id })
        .getMany();

    ctx.body = {
        applications,
    };
});

mappersChoiceRouter.post('/save', async (ctx) => {
    const chosenAppsIds = convertToArray(ctx.request.body.chosenAppsIds);
    const captain: User = ctx.state.user;

    const country = await Country.findOneOrFail({ id: captain.country.id });
    let applications = await MapperApplication.findByIds(chosenAppsIds, { relations: ['user'] });

    applications = applications.filter((a) => a.user.country.id === country.id && a.user.id !== captain.id);

    const mappers = applications.map((a) => a.user);

    if (mappers.length < 2 || mappers.length > 6) {
        return ctx.body = {
            error: 'You need to pick between 2 and 6 members',
        };
    }

    const currentContestants = await User.find({
        roleId: ROLE.Contestant,
        country,
    });

    for (const contestant of currentContestants) {
        if (!mappers.some(m => m.id === contestant.id)) {
            contestant.roleId = ROLE.BasicUser;
            await contestant.save();
        }
    }

    for (const mapper of mappers) {
        mapper.roleId = ROLE.Contestant;
        await mapper.save();
    }

    ctx.body = {
        success: 'Saved',
    };

    await Log.createAndSave(`${ctx.state.user.username} submitted its mappers choice`, LOG_TYPE.User, ctx.state.user.id);
});

export default mappersChoiceRouter;
