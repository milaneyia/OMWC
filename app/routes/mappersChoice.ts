import Router from '@koa/router';
import { convertToArray } from '../helpers';
import { authenticate, isCaptain } from '../middlewares/authentication';
import { onGoingMappersChoice } from '../middlewares/scheduleCheck';
import { MapperApplication } from '../models/applications/MapperApplication';
import { User } from '../models/User';
import { Country } from '../models/Country';
import { ROLE } from '../models/Role';

const mappersChoiceRouter = new Router();

mappersChoiceRouter.prefix('/api/mappersChoice');
mappersChoiceRouter.use(authenticate);
mappersChoiceRouter.use(onGoingMappersChoice);
mappersChoiceRouter.use(isCaptain);

mappersChoiceRouter.get('/', async (ctx) => {
    const applications = await MapperApplication
        .createQueryBuilder('mapperApplication')
        .innerJoinAndSelect('mapperApplication.user', 'user')
        .innerJoin('user.country', 'country', 'country.id = :country', { country: ctx.state.user.country.id })
        .getMany();

    ctx.body = {
        applications,
    };
});

mappersChoiceRouter.post('/save', async (ctx) => {
    const applicationsIds = convertToArray(ctx.request.body.applicationsIds);
    const captain: User = ctx.state.user;

    const country = await Country.findOneOrFail({ id: captain.country.id });
    let applications = await MapperApplication.findByIds(applicationsIds, { relations: ['user'] });

    applications = applications.filter((a) => a.user.country.id === country.id);

    const mappers = applications.map((a) => a.user);
    mappers.push(captain);

    if (mappers.length > 6) {
        return ctx.body = {
            error: 'Too many members in the team',
        };
    }

    // TODO: test
    for (const mapper of mappers) {
        mapper.roleId = ROLE.Contestant;
        await mapper.save();
    }

    ctx.body = {
        success: 'ok',
    };
});

export default mappersChoiceRouter;
