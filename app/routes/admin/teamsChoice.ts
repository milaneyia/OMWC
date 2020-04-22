import Router from '@koa/router';
import { convertToIntOrThrow } from '../../helpers';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Country } from '../../models/Country';
import { ROLE } from '../../models/Role';

const teamsChoiceAdminRouter = new Router();

teamsChoiceAdminRouter.prefix('/api/admin/teamsChoice');
teamsChoiceAdminRouter.use(authenticate);
teamsChoiceAdminRouter.use(isStaff);

teamsChoiceAdminRouter.get('/', async (ctx) => {
    const countries = await Country
        .createQueryBuilder('country')
        .innerJoinAndSelect('country.users', 'user')
        .leftJoinAndSelect('user.mapperApplication', 'mapperApplication')
        .where('user.mapperApplication IS NOT NULL')
        .orWhere('user.roleId = :captain', { captain: ROLE.Captain })
        .getMany();

    ctx.body = {
        countries,
    };
});

teamsChoiceAdminRouter.post('/confirm', async (ctx) => {
    const countryId = convertToIntOrThrow(ctx.request.body.countryId);
    const country = await Country.findOneOrFail({ id: countryId });
    country.wasConfirmed = true;
    await country.save();

    ctx.body = {
        success: 'ok',
    };
});

teamsChoiceAdminRouter.post('/remove', async (ctx) => {
    const countryId = convertToIntOrThrow(ctx.request.body.countryId);
    const country = await Country.findOneOrFail({ id: countryId });
    country.wasConfirmed = false;
    await country.save();

    ctx.body = {
        success: 'ok',
    };
});

export default teamsChoiceAdminRouter;
