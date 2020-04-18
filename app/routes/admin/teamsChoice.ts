import Router from '@koa/router';
import { convertToIntOrThrow } from '../../helpers';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { MapperApplication } from '../../models/applications/MapperApplication';
import { Country } from '../../models/Country';

const teamsChoiceAdminRouter = new Router();

teamsChoiceAdminRouter.prefix('/api/admin/teamsChoice');
teamsChoiceAdminRouter.use(authenticate);
teamsChoiceAdminRouter.use(isStaff);

teamsChoiceAdminRouter.get('/', async (ctx) => {
    const applications = await MapperApplication.find({ relations: ['user'] });
    const countries = await Country.find({});

    ctx.body = {
        applications,
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

teamsChoiceAdminRouter.post('/deny', async (ctx) => {
    const countryId = convertToIntOrThrow(ctx.request.body.countryId);
    const country = await Country.findOneOrFail({ id: countryId });
    country.wasConfirmed = false;
    await country.save();

    ctx.body = {
        success: 'ok',
    };
});

export default teamsChoiceAdminRouter;
