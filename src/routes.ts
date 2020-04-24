import { RouteConfig } from 'vue-router';
import Index from './views/Index.vue';
import NotFound from './views/NotFound.vue';
import Captain from './views/applications/Captain.vue';
import Mapper from './views/applications/Mapper.vue';
import ManageSchedule from './views/admin/ManageSchedule.vue';
import CaptainChoice from './views/admin/CaptainChoice.vue';
import TeamChoice from './views/admin/TeamChoice.vue';
import RoundListing from './views/admin/rounds/RoundListing.vue';
import ManageRound from './views/admin/rounds/ManageRound.vue';
import ManageMatch from './views/admin/rounds/ManageMatch.vue';
import RequestAccess from './views/admin/RequestAccess.vue';

const routes: RouteConfig[] = [
    { path: '*', component: NotFound },
    // { path: '*', redirect: '/' },
    { path: '/', component: Index },

    { path: '/applications/captains', component: Captain },
    { path: '/applications/mappers', component: Mapper },

    { path: '/admin/users/access', component: RequestAccess },
    { path: '/admin/schedule', component: ManageSchedule },
    { path: '/admin/captainChoice', component: CaptainChoice },
    { path: '/admin/teamsChoice', component: TeamChoice },
    { path: '/admin/rounds', component: RoundListing },
    { path: '/admin/rounds/create', component: ManageRound },
    { path: '/admin/rounds/:id(\\d+)', component: ManageRound },
    { path: '/admin/rounds/:id(\\d+)/matches', component: ManageMatch },
];

export default routes;
