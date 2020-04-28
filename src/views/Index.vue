<template>
    <div>
        <div class="container text-center">
            <div class="row mb-2">
                <div class="col-sm">
                    <div
                        v-if="user"
                        class="header"
                    >
                        <img
                            src="/img/logo.png"
                            width="60"
                            heigth="60"
                        >
                        <div>
                            <h3 class="ml-2">
                                Welcome
                                <b>{{ user.username }}</b>
                            </h3>
                            <div class="d-flex ml-2 align-items-center">
                                <span class="mr-2">
                                    you're participating for <b>{{ user.country.name }}</b>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div
                        v-else
                        class="my-4"
                    >
                        <img
                            src="/img/logo_large.png"
                            width="150"
                            height="150"
                            class="mt-2"
                        >
                        <h2>osu! Beatmapping World Cup</h2>
                        <h5>
                            from may 02 to october 17
                        </h5>
                    </div>
                </div>
            </div>
        </div>

        <div class="d-flex" style="background-color: rgb(23, 26, 28)">
            <div class="container text-center" style="margin-top: -30px">
                <home-nav
                    :schedule="schedule"
                    :user="user"
                />

                <div class="row mb-2">
                    <div class="col-sm">
                        <div class="card">
                            <div class="card-header">
                                <div class="d-flex justify-content-around flex-wrap">
                                    <a
                                        class="d-flex align-items-center mb-3 mb-sm-0"
                                        href="#"
                                        target="__blank"
                                    >
                                        <i class="fab fa-discord fa-3x text-white" />
                                        <h4 class="ml-3">Join us!</h4>
                                    </a>
                                    <a
                                        class="d-flex align-items-center mb-3 mb-sm-0"
                                        href="#"
                                        target="__blank"
                                    >
                                        <span class="country-flag" style="background-image: url('/img/osu.png'); height: 50px; width: 50px;" />
                                        <h4 class="ml-3">
                                            Forum Post
                                        </h4>
                                    </a>
                                    <a
                                        class="d-flex align-items-center mb-3 mb-sm-0"
                                        href="https://pickem.hwchr.com/tournaments/30"
                                        target="__blank"
                                    >
                                        <span class="country-flag" style="background-image: url('/img/pickem.png'); height: 50px; width: 50px;" />
                                        <h4 class="ml-3">
                                            Pick'em
                                        </h4>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mb-2">
                    <div class="col-sm">
                        <div class="card">
                            <div class="card-header">
                                <h3>Prizes</h3>

                                <small>
                                    supporter tags are for each team member
                                </small>
                            </div>

                            <div class="card-body">
                                <div class="row">
                                    <div class="col-sm">
                                        <h5 class="text-warning">
                                            <i class="fas fa-crown mr-2" />
                                            1st place
                                        </h5>

                                        <div>
                                            <p>
                                                <img class="mr-2" src="https://assets.ppy.sh/profile-badges/oimc2-2018.jpg">
                                                Profile badge
                                            </p>
                                            <p>
                                                <i class="fas fa-heart mr-2" />
                                                8 months of osu!supporter
                                            </p>

                                            <p>
                                                <i class="fas fa-check mr-2" />
                                                compilation of all the team entries in qualified section
                                            </p>
                                        </div>

                                        <hr>

                                        <h5 class="text-info">
                                            <i class="fas fa-crown mr-2" />
                                            2nd place
                                        </h5>
                                        <p>
                                            <i class="fas fa-heart mr-2" />
                                            6 months of osu!supporter
                                        </p>

                                        <hr>

                                        <h5 class="text-white-50">
                                            <i class="fas fa-crown mr-2" />
                                            3rd place
                                        </h5>

                                        <p>
                                            <i class="fas fa-heart mr-2" />
                                            4 months of osu!supporter
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mb-2">
                    <div class="col-sm">
                        <div class="card">
                            <div class="card-header">
                                <h3>Schedule</h3>
                            </div>

                            <div class="card-body">
                                <div class="row">
                                    <div class="col-sm">
                                        <h5>
                                            <i class="fas fa-clock mr-2" />
                                            Preparation phase
                                        </h5>

                                        <div>
                                            <p>
                                                from may 02 to may 29
                                            </p>
                                        </div>

                                        <hr>

                                        <h5>
                                            <i class="fas fa-clock mr-2" />
                                            Qualifiers
                                        </h5>
                                        <p>
                                            from may 30 to june 27
                                        </p>

                                        <hr>

                                        <h5>
                                            <i class="fas fa-clock mr-2" />
                                            Head-to-head elimination
                                        </h5>

                                        <p>
                                            from june 30 to october 08
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { State } from 'vuex-class';
import HomeNav from '../components/HomeNav.vue';

@Component({
    components: {
        HomeNav,
    },
})
export default class Index extends Vue {

    @State user!: object;
    @State schedule!: object;

}
</script>
