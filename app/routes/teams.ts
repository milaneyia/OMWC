import Router from '@koa/router';
import { Country } from '../models/Country';
import { ROLE } from '../models/Role';
import { Brackets } from 'typeorm';

const teamsRouter = new Router();

teamsRouter.prefix('/api/teams');

teamsRouter.get('/', async (ctx) => {
    const teams = await Country
        .createQueryBuilder('country')
        .innerJoinAndSelect('country.users', 'users')
        .where('country.wasConfirmed = 1')
        .andWhere(new Brackets(qb => {
            qb.where('users.roleId = :captain', { captain: ROLE.Captain })
                .orWhere('users.roleId = :contestant', { contestant: ROLE.Contestant });
        }))
        .orderBy('country.name', 'ASC')
        .addOrderBy('users.roleId', 'DESC')
        .getMany();

    ctx.body = {
        teams,
    };
});

export default teamsRouter;
