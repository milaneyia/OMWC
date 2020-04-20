import Index from './views/Index.vue';
import NotFound from './views/NotFound.vue';
import Captain from './views/applications/Captain.vue';
import Mapper from './views/applications/Mapper.vue';

const routes = [
    { path: '*', component: NotFound },
    // { path: '*', redirect: '/' },
    { path: '/', component: Index },
    { path: '/applications/captains', component: Captain },
    { path: '/applications/mappers', component: Mapper },
];

export default routes;
