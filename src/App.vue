<template>
    <div id="app">
        <nav class="nav navbar navbar-expand-lg navbar-dark bg-dark">
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
                data-target="#navbar"
            >
                <span class="navbar-toggler-icon" />
            </button>

            <div id="#navbar" class="collapse navbar-collapse">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/">
                            Home
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/leaderboard">
                            Leaderboard
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/judgingResults">
                            Results
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/teams">
                            Teams
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/staff">
                            Staff
                        </router-link>
                    </li>

                    <li v-if="user && user.isStaff" class="nav-item.dropdown">
                        <a
                            class="nav-link dropdown-toggle"
                            href="#"
                            data-toggle="dropdown"
                        >
                            Admin
                        </a>

                        <div class="dropdown-menu">
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
                            <router-link to="/admin/judging/criterias" class="dropdown-item">
                                Criterias
                            </router-link>
                            <router-link to="/admin/judging" class="dropdown-item">
                                Judging List
                            </router-link>
                            <div class="dropdown-divider" />
                            <router-link to="/admin/rounds" class="dropdown-item">
                                Rounds
                            </router-link>
                            <router-link to="/admin/manageSubmissions" class="dropdown-item">
                                Submissions
                            </router-link>
                        </div>
                    </li>
                </ul>

                <form
                    v-if="!user"
                    action="/login"
                    method="get"
                    class="form-inline my-2 my-lg-0 ml-3"
                >
                    <button class="btn btn-primary" type="submit">
                        Verify your osu! account
                    </button>
                </form>
            </div>
        </nav>

        <router-view />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Axios from 'axios';
import { mapState } from 'vuex';

export default Vue.extend({
    computed: mapState({
        'user': (state: any) => state.main.user,
    }),
    async mounted () {
        const res = await Axios.get('/api/');
        this.$store.commit('setData', res.data);
        console.log(res.data);
    },
});
</script>
