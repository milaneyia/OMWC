import Router from '@koa/router';
import { Team } from '../models/Team';

const teamsRouter = new Router();

teamsRouter.prefix('/teams');

teamsRouter.get('/', async (ctx) => {
    const teams = await Team.find({
        relations: [
            'country',
            'users',
        ],
    });

    return await ctx.render('teams', {
        path: '/teams',
        teams,
    });
});

export default teamsRouter;
