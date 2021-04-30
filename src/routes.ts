/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { RouteConfig } from 'vue-router';
import Index from './views/Index.vue';
const Information = () => import(/* webpackChunkName: "info", webpackPrefetch: true */ './views/Information.vue');
const StaffListing = () => import(/* webpackChunkName: "info", webpackPrefetch: true */ './views/StaffListing.vue');
const TeamListing = () => import(/* webpackChunkName: "info", webpackPrefetch: true */ './views/TeamListing.vue');
const QualifierResult = () => import(/* webpackChunkName: "results", webpackPrefetch: true */ './views/results/QualifierResult.vue');
const EliminationResult = () => import(/* webpackChunkName: "results", webpackPrefetch: true */ './views/results/EliminationResult.vue');

const routes: RouteConfig[] = [
    { path: '/', component: Index },
    { path: '/info', component: Information, meta: { title: 'Information - osu!BWC' } },
    { path: '/staff', component: StaffListing, meta: { title: 'Staff - osu!BWC' } },
    { path: '/teams', component: TeamListing, meta: { title: 'Teams - osu!BWC' } },
    { path: '/results/qualifiers', component: QualifierResult, meta: { title: 'Results - osu!BWC' } },
    { path: '/results/elimination', component: EliminationResult, meta: { title: 'Results - osu!BWC' } },

    { path: '*', redirect: '/' },
];

export default routes;
