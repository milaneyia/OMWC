/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { RouteConfig } from 'vue-router';
import Index from './views/Index.vue';
const StaffListing = () => import(/* webpackChunkName: "info", webpackPrefetch: true */ './views/StaffListing.vue');
const TeamListing = () => import(/* webpackChunkName: "info", webpackPrefetch: true */ './views/TeamListing.vue');
const QualifierResult = () => import(/* webpackChunkName: "results" */ './views/QualifierResult.vue');
const Captain = () => import(/* webpackChunkName: "apps" */ './views/applications/Captain.vue');
const Mapper = () => import(/* webpackChunkName: "apps" */ './views/applications/Mapper.vue');
const Voting = () => import(/* webpackChunkName: "apps" */ './views/applications/Voting.vue');
const MapperChoice = () => import(/* webpackChunkName: "captain" */ './views/applications/MapperChoice.vue');
const Submission = () => import(/* webpackChunkName: "captain" */ './views/Submission.vue');
const ManageSchedule = () => import(/* webpackChunkName: "admin" */ './views/admin/ManageSchedule.vue');
const CaptainChoice = () => import(/* webpackChunkName: "admin" */ './views/admin/CaptainChoice.vue');
const TeamChoice = () => import(/* webpackChunkName: "admin" */ './views/admin/TeamChoice.vue');
const ManageRound = () => import(/* webpackChunkName: "admin" */ './views/admin/rounds/ManageRound.vue');
const RoundListing = () => import(/* webpackChunkName: "admin" */ './views/admin/rounds/RoundListing.vue');
const ManageMatch = () => import(/* webpackChunkName: "admin" */ './views/admin/rounds/ManageMatch.vue');
const RequestAccess = () => import(/* webpackChunkName: "admin" */ './views/admin/RequestAccess.vue');
const SubmissionListing = () => import(/* webpackChunkName: "admin" */ './views/admin/SubmissionListing.vue');

const routes: RouteConfig[] = [
    { path: '/', component: Index },
    { path: '/staff', component: StaffListing },
    { path: '/teams', component: TeamListing },
    { path: '/results/qualifiers', component: QualifierResult },

    { path: '/submissions', component: Submission },

    { path: '/applications/captains', component: Captain },
    { path: '/applications/mappers', component: Mapper },
    { path: '/applications/voting', component: Voting },
    { path: '/applications/mappersChoice', component: MapperChoice },

    { path: '/admin/users/access', component: RequestAccess },
    { path: '/admin/schedule', component: ManageSchedule },
    { path: '/admin/captainChoice', component: CaptainChoice },
    { path: '/admin/teamsChoice', component: TeamChoice },
    { path: '/admin/rounds', component: RoundListing },
    { path: '/admin/rounds/create', component: ManageRound },
    { path: '/admin/rounds/:id(\\d+)', component: ManageRound },
    { path: '/admin/rounds/:id(\\d+)/matches', component: ManageMatch },
    { path: '/admin/submissions', component: SubmissionListing },

    { path: '*', redirect: '/' },
];

export default routes;
