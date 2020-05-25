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
        .innerJoin('country.users', 'user')
        .where('user.mapperApplicationId IS NOT NULL')
        .orWhere('user.roleId = :captain', { captain: ROLE.Captain })
        .orWhere('user.roleId = :contestant', { contestant: ROLE.Contestant })
        .select([
            'country.id',
            'country.name',
            'country.wasConfirmed',
            'country.code',
            'user.id',
            'user.username',
            'user.osuId',
            'user.roleId',
            'user.mapperApplicationId',
        ])
        .orderBy('country.name', 'ASC')
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
        success: 'Saved',
    };
});

teamsChoiceAdminRouter.post('/remove', async (ctx) => {
    const countryId = convertToIntOrThrow(ctx.request.body.countryId);
    const country = await Country.findOneOrFail({ id: countryId });
    country.wasConfirmed = false;
    await country.save();

    ctx.body = {
        success: 'Saved',
    };
});

export default teamsChoiceAdminRouter;
