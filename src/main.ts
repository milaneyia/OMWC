import './hooks';
import Vue, { VNode } from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import App from './App.vue';
import storeOptions from './store';
import routes from './routes';
import './sass/app.scss';
import Axios from 'axios';

Vue.use(VueRouter);
Vue.use(Vuex);

const store = new Vuex.Store(storeOptions);

const router = new VueRouter({
    mode: 'history',
    routes,
    linkExactActiveClass: 'active',
});

router.beforeEach(async (to, from, next) => {
    if (!store.state.initialized) {
        const res = await Axios.get('/api/');
        store.commit('setData', res.data);
    }

    if (to.matched.some(r => r.path.startsWith('/admin')) && !store.state.user?.isStaff) {
        next({ path: '/' });
    } else {
        next();
    }
});

Vue.filter('shortDateTimeString', (value: string) => {
    if (!value) return '';

    return new Date(value).toLocaleString('en-US', { month: 'long', day: 'numeric', hour: 'numeric' });
});

new Vue({
    store,
    router,
    render: (h): VNode => h(App),
}).$mount('#app');
