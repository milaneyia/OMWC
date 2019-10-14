import Router from '@koa/router';
import { authenticate, isStaff } from '../../../middlewares/authentication';
import { JudgingCriteria } from '../../../models/judging/JudgingCriteria';

const criteriasAdminRouter = new Router();

criteriasAdminRouter.prefix('/admin/judging/criterias');
criteriasAdminRouter.use(authenticate);
criteriasAdminRouter.use(isStaff);

criteriasAdminRouter.get('/', async (ctx) => {
    const criterias = await JudgingCriteria.find();

    return ctx.render('admin/judging/criterias/index', {
        criterias,
    });
});

criteriasAdminRouter.get('/create', async (ctx) => {
    return ctx.render('admin/judging/criterias/manage');
});

criteriasAdminRouter.get('/edit/:id', async (ctx) => {
    const criteria = await JudgingCriteria.findOneOrFail({ where: { id: ctx.params.id } });

    return ctx.render('admin/judging/criterias/manage', {
        criteria,
    });
});

criteriasAdminRouter.post('/save', async (ctx) => {
    let criteria = await JudgingCriteria.findOne({ where: { id: ctx.request.body.criteriaId } });

    if (!criteria) {
        criteria = new JudgingCriteria();
    }

    if (!ctx.request.body.name) {
        return ctx.render('error');
    }

    criteria.name = ctx.request.body.name.trim();
    criteria.maxScore = ctx.request.body.maxScore;
    await criteria.save();

    return ctx.redirect('/admin/judging/criterias');
});

export default criteriasAdminRouter;
