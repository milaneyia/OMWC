<template>
    <div
        v-cloak
        id="app"
        :class="$route.path === '/' && !user ? 'hero' : ''"
    >
        <nav
            class="nav navbar navbar-expand-md navbar-dark"
            :class="$route.path !== '/' || ($route.path === '/' && user) ? 'navbar-triangles' : ''"
        >
            <router-link to="/" class="navbar-brand p-0">
                <img
                    src="/img/logo.png"
                    width="36"
                    height="36"
                    alt="osu!BWC"
                    class="d-inline-block mr-2"
                >
            </router-link>

            <button
                class="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#obwcNavbar"
            >
                <span class="navbar-toggler-icon" />
            </button>

            <div id="obwcNavbar" class="collapse navbar-collapse">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/">
                            Home
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/info">
                            Information
                        </router-link>
                    </li>
                    <template v-if="hasMappersChoiceEnded">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/teams">
                                Teams
                            </router-link>
                        </li>
                        <li class="nav-item dropdown">
                            <a
                                class="nav-link dropdown-toggle"
                                href="#"
                                data-toggle="dropdown"
                            >
                                Results
                            </a>

                            <div class="dropdown-menu">
                                <router-link to="/results/qualifiers" class="dropdown-item">
                                    Qualifiers
                                </router-link>
                                <router-link to="/results/elimination" class="dropdown-item">
                                    Eliminations
                                </router-link>
                            </div>
                        </li>
                    </template>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/staff">
                            Staff
                        </router-link>
                    </li>

                    <li v-if="user && user.isStaff" class="nav-item dropdown">
                        <a
                            class="nav-link dropdown-toggle"
                            href="#"
                            data-toggle="dropdown"
                        >
                            Admin
                        </a>

                        <div class="dropdown-menu">
                            <router-link to="/admin/users/access" class="dropdown-item">
                                Access Requests
                            </router-link>
                            <router-link to="/admin/schedule" class="dropdown-item">
                                Schedule
                            </router-link>
                            <div class="dropdown-divider" />
                            <router-link to="/admin/captainChoice" class="dropdown-item">
                                Captain Choice
                            </router-link>
                            <router-link to="/admin/teamsChoice" class="dropdown-item">
                                Teams Choice
                            </router-link>
                            <div class="dropdown-divider" />
                            <router-link to="/admin/rounds" class="dropdown-item">
                                Rounds
                            </router-link>
                            <router-link to="/admin/submissions" class="dropdown-item">
                                Submissions
                            </router-link>
                            <div class="dropdown-divider" />
                            <router-link to="/admin/judging" class="dropdown-item">
                                Judging List
                            </router-link>
                            <div class="dropdown-divider" />
                            <router-link to="/admin/users/roles" class="dropdown-item">
                                Edit User Role
                            </router-link>
                            <router-link to="/admin/logs" class="dropdown-item">
                                Logs
                            </router-link>
                        </div>
                    </li>
                </ul>

                <a
                    v-if="!user && initialized"
                    href="/api/login"
                    class="my-2 my-lg-0"
                >
                    Verify your osu! account
                </a>
                <a
                    v-else
                    href="/api/logout"
                    class="my-2 my-lg-0"
                >
                    Log out
                </a>
            </div>
        </nav>

        <loading-page>
            <transition name="route-transition" mode="out-in">
                <router-view />
            </transition>
        </loading-page>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { State } from 'vuex-class';
import LoadingPage from './components/LoadingPage.vue';
import { Schedule, User } from './interfaces';

@Component({
    components: {
        LoadingPage,
    },
})
export default class App extends Vue {

    @State initialized!: boolean;
    @State user!: User;
    @State schedule!: Schedule;

    get hasMappersChoiceEnded (): boolean {
        return this.schedule?.mappersChoiceEndedAt && new Date(this.schedule.mappersChoiceEndedAt) < new Date();
    }

}
</script>

<style lang="scss">
.route-transition-enter-active, .route-transition-leave-active {
  transition: opacity .2s;
}
.route-transition-enter, .route-transition-leave-to {
  opacity: 0;
}
</style>
