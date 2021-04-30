import './hooks';
import Vue, { VNode } from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import App from './App.vue';
import storeOptions from './store';
import routes from './routes';
import './sass/app.scss';

$(document).ready(function() {
    $('body').tooltip({ selector: '[data-toggle=tooltip]', trigger: 'hover' });
});

Vue.use(VueRouter);
Vue.use(Vuex);

const store = new Vuex.Store(storeOptions);

const router = new VueRouter({
    mode: 'history',
    routes,
    linkExactActiveClass: 'active',
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'osu! Beatmapping World Championship';
    next();
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
