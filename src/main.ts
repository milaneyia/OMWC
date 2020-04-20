import './hooks';
import Vue from 'vue';
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
        next();
    } else {
        next();
    }
});

const app = new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app');
