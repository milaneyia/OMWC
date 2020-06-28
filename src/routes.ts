/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { RouteConfig } from 'vue-router';
import Index from './views/Index.vue';
const Information = () => import(/* webpackChunkName: "info", webpackPrefetch: true */ './views/Information.vue');
const StaffListing = () => import(/* webpackChunkName: "info", webpackPrefetch: true */ './views/StaffListing.vue');
const TeamListing = () => import(/* webpackChunkName: "info", webpackPrefetch: true */ './views/TeamListing.vue');
const QualifierResult = () => import(/* webpackChunkName: "results", webpackPrefetch: true */ './views/results/QualifierResult.vue');
const EliminationResult = () => import(/* webpackChunkName: "results", webpackPrefetch: true */ './views/results/EliminationResult.vue');
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
const ManageGenres = () => import(/* webpackChunkName: "admin" */ './views/admin/rounds/ManageGenres.vue');
const RequestAccess = () => import(/* webpackChunkName: "admin" */ './views/admin/RequestAccess.vue');
const ManageUser = () => import(/* webpackChunkName: "admin" */ './views/admin/ManageUser.vue');
const LogListing = () => import(/* webpackChunkName: "admin" */ './views/admin/LogListing.vue');
const SubmissionListing = () => import(/* webpackChunkName: "admin" */ './views/admin/SubmissionListing.vue');
const JudgingListing = () => import(/* webpackChunkName: "admin" */ './views/admin/JudgingListing.vue');
const Judging = () => import(/* webpackChunkName: "judging" */ './views/Judging.vue');

const routes: RouteConfig[] = [
    { path: '/', component: Index },
    { path: '/info', component: Information, meta: { title: 'Information - osu!BWC' } },
    { path: '/staff', component: StaffListing, meta: { title: 'Staff - osu!BWC' } },
    { path: '/teams', component: TeamListing, meta: { title: 'Teams - osu!BWC' } },
    { path: '/results/qualifiers', component: QualifierResult, meta: { title: 'Results - osu!BWC' } },
    { path: '/results/elimination', component: EliminationResult, meta: { title: 'Results - osu!BWC' } },

    { path: '/submissions', component: Submission, meta: { title: 'Submissions - osu!BWC' } },

    { path: '/applications/captains', component: Captain, meta: { title: 'Captain Apps - osu!BWC' } },
    { path: '/applications/mappers', component: Mapper, meta: { title: 'Mappers Apps - osu!BWC' } },
    { path: '/applications/voting', component: Voting, meta: { title: 'Captain Voting - osu!BWC' } },
    { path: '/applications/mappersChoice', component: MapperChoice, meta: { title: 'Mappers Choice - osu!BWC' } },

    { path: '/admin/logs', component: LogListing, meta: { title: 'Logs - osu!BWC' } },
    { path: '/admin/users/access', component: RequestAccess, meta: { title: 'Access Requests - osu!BWC' } },
    { path: '/admin/users/roles', component: ManageUser, meta: { title: 'Manage Roles - osu!BWC' } },
    { path: '/admin/schedule', component: ManageSchedule, meta: { title: 'Schedule - osu!BWC' } },
    { path: '/admin/captainChoice', component: CaptainChoice, meta: { title: 'Captain Choice - osu!BWC' } },
    { path: '/admin/teamsChoice', component: TeamChoice, meta: { title: 'Teams Choice - osu!BWC' } },
    { path: '/admin/rounds', component: RoundListing, meta: { title: 'Manage Rounds - osu!BWC' } },
    { path: '/admin/rounds/create', component: ManageRound, meta: { title: 'Manage Rounds - osu!BWC' } },
    { path: '/admin/rounds/:id(\\d+)', component: ManageRound, meta: { title: 'Manage Rounds - osu!BWC' } },
    { path: '/admin/rounds/:id(\\d+)/matches', component: ManageMatch, meta: { title: 'Manage Rounds - osu!BWC' } },
    { path: '/admin/rounds/:id(\\d+)/genres', component: ManageGenres, meta: { title: 'Manage Genres - osu!BWC' } },
    { path: '/admin/submissions', component: SubmissionListing, meta: { title: 'Manage Submissions - osu!BWC' } },
    { path: '/admin/judging', component: JudgingListing, meta: { title: 'Judging - osu!BWC' } },

    { path: '/judging', component: Judging, meta: { title: 'Judging - osu!BWC' } },

    { path: '*', redirect: '/' },
];

export default routes;
