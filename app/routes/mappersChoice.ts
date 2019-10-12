import Router from '@koa/router';
import { authenticate, isCaptain } from '../middlewares/authentication';
import { onGoingMappersChoice } from '../middlewares/scheduleCheck';
import { MapperApplication } from '../models/applications/MapperApplication';
import { Team } from '../models/Team';
import { User } from '../models/User';

const mappersChoiceRouter = new Router();

mappersChoiceRouter.prefix('/mappersChoice');
mappersChoiceRouter.use(authenticate);
mappersChoiceRouter.use(onGoingMappersChoice);
mappersChoiceRouter.use(isCaptain);

mappersChoiceRouter.get('/', async (ctx) => {
    const applications = await MapperApplication
        .createQueryBuilder('mapperApplication')
        .innerJoinAndSelect('mapperApplication.user', 'user')
        .innerJoin('user.country', 'country', 'country.id = :country', { country: ctx.state.user.country.id })
        .getMany();

    const team = await Team.findOneWithUsers(ctx.state.user.country.id);

    return ctx.render('mappersChoice', {
        applications,
        team,
        user: ctx.state.user,
    });
});

mappersChoiceRouter.post('/save', async (ctx) => {
    const applicationsIds = ctx.request.body.applicationsIds;

    if (!applicationsIds || !applicationsIds.length) {
        return ctx.redirect('back');
    }

    const captain: User = ctx.state.user;
    const team = await Team.findOneOrFail({ where: { countryId: captain.country.id } });
    let applications = await MapperApplication.findByIds(applicationsIds, { relations: ['user'] });

    applications = applications.filter((a) => a.user.country.id === team.countryId);

    const mappers = applications.map((a) => a.user);
    mappers.push(captain);

    if (mappers.length > 6) {
        return ctx.render('error', { error: 'Too many members in the team' });
    }

    team.users = mappers;
    team.save();

    return ctx.redirect('back');
});

export default mappersChoiceRouter;
