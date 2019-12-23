import Router from '@koa/router';
import { Team } from '../models/Team';
import { User } from '../models/User';

const teamsRouter = new Router();

teamsRouter.prefix('/teams');

teamsRouter.get('/', async (ctx) => {
    const teams = await Team.find({
        relations: [
            'country',
            'users',
        ],
    });

    const osuId = ctx.session.osuId;
    let user;

    if (osuId) {
        user = await User.findOne({ osuId });
    }

    return await ctx.render('teams', {
        path: '/teams',
        teams,
        user,
    });
});

export default teamsRouter;
