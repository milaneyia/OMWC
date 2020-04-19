import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import App from './App.vue';
import mainModule from './store';
import routes from './routes';
import './sass/app.scss';

Vue.use(VueRouter);
Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        main: mainModule,
    },
});

const router = new VueRouter({
    mode: 'history',
    routes,
    linkExactActiveClass: 'active',
});

const app = new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app');
