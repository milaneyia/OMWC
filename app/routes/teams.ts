import Router from '@koa/router';
import { Country } from '../models/Country';

const teamsRouter = new Router();

teamsRouter.prefix('/api/teams');

teamsRouter.get('/', async (ctx) => {
    const teams = await Country.find({
        where: {
            isCompeting: true,
            // TODO: or eliminatedRound
        },
        relations: [
            'users',
        ],
    });

    ctx.body = {
        teams,
    };
});

export default teamsRouter;
