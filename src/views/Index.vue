<template>
    <div class="container text-center">
        <div class="row mb-2">
            <div class="col-sm">
                <div v-if="user" class="header">
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
                <div v-else>
                    <h2>osu! Mapping World Cup</h2>
                    <h5>xx january to xx something</h5>
                    <img
                        src="/img/logo.png"
                        width="350"
                        height="350"
                    >
                </div>
            </div>
        </div>

        <div v-if="user && !user.isRestricted && schedule" class="row mb-2">
            <div class="col-sm">
                <div class="card">
                    <div class="card-body">
                        <div v-if="user.isBasicUser">
                            Request Access
                        </div>

                        <div v-if="user.isElevatedUser && schedule.applicationsEndedAt && new Date(schedule.applicationsEndedAt) > new Date()">
                            <router-link to="/applications/captains" class="btn btn-primary btn-block btn-lg">
                                {{ user.captainApplication ? 'Edit your team captain application' : 'Apply for team captain' }}
                            </router-link>

                            <p class="small">
                                from {{ new Date(schedule.applicationsStartedAt).toLocaleString() }}
                                to {{ new Date(schedule.applicationsEndedAt).toLocaleString() }}
                            </p>
                        </div>

                        <div v-if="schedule.applicationsEndedAt && new Date(schedule.applicationsEndedAt) > new Date()">
                            <a
                                v-if="user.mapperApplication"
                                href="#"
                                class="btn btn-secondary disabled btn-block btn-lg"
                            >
                                You've applied as a mapper
                            </a>

                            <template v-else>
                                <router-link to="/applications/mappers/" class="btn btn-primary btn-block btn-lg">
                                    Apply as a mapper
                                </router-link>

                                <p class="small">
                                    from {{ new Date(schedule.applicationsStartedAt).toLocaleString() }}
                                    to {{ new Date(schedule.applicationsEndedAt).toLocaleString() }}
                                </p>
                            </template>
                        </div>

                        <hr>

                        <div v-if="user.isElevatedUser && schedule.captainVotingEndedAt && new Date(schedule.captainVotingEndedAt) > new Date()">
                            <a
                                v-if="new Date(schedule.captainVotingStartedAt) > new Date()"
                                href="#"
                                class="btn btn-secondary disabled btn-block btn-lg"
                            >
                                Captain Voting
                            </a>

                            <router-link
                                v-else
                                to="/captainVoting"
                                class="btn btn-primary btn-block btn-lg"
                            >
                                Captain Voting
                            </router-link>

                            <p class="small">
                                from {{ new Date(schedule.captainVotingStartedAt).toLocaleString() }}
                                to {{ new Date(schedule.captainVotingEndedAt).toLocaleString() }}
                            </p>
                        </div>

                        <div v-if="schedule.mappersChoiceEndedAt && new Date(schedule.mappersChoiceEndedAt) > new Date() && user.isCaptain">
                            <router-link to="/mappersChoice" class="btn btn-primary btn-block btn-lg">
                                Mappers Choice
                            </router-link>

                            <p class="small">
                                from {{ new Date(schedule.mappersChoiceStartedAt).toLocaleString() }}
                                to {{ new Date(schedule.mappersChoiceEndedAt).toLocaleString() }}
                            </p>
                        </div>

                        <router-link
                            v-if="user.isCaptain"
                            to="/submissions"
                            class="btn btn-primary btn-block btn-lg"
                        >
                            .osz submissions
                        </router-link>

                        <template v-if="user.isJudge">
                            <hr>

                            <a
                                v-if="judgingRound"
                                href="#"
                                class="btn btn-secondary disabled btn-block btn-lg"
                            >
                                Judging
                            </a>

                            <router-link
                                v-if="user.isCaptain"
                                to="/judging"
                                class="btn btn-primary btn-block btn-lg"
                            >
                                Judging
                            </router-link>
                        </template>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mb-2">
            <div class="col-sm">
                <div class="card">
                    <div class="card-header">
                        <div class="d-flex justify-content-around">
                            <a
                                class="d-flex align-items-center"
                                href="#"
                                target="__blank"
                            >
                                <i class="fab fa-discord fa-3x text-white" />
                                <h4 class="ml-3">Join us!</h4>
                            </a>
                            <a
                                class="d-flex align-items-center"
                                href="#"
                                target="__blank"
                            >
                                <span class="country-flag" style="background-image: url('/img/osu.png'); height: 50px; width: 50px;" />
                                <h4 class="ml-3">
                                    Forum Post
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
                        <small>imagine some fancy image instead of text below</small>
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
                                        6 months of osu!supporter
                                    </p>
                                </div>

                                <hr>

                                <h5 class="text-info">
                                    <i class="fas fa-crown mr-2" />
                                    2nd place
                                </h5>
                                <p>
                                    <i class="fas fa-heart mr-2" />
                                    4 months of osu!supporter
                                </p>

                                <hr>

                                <h5 class="text-white-50">
                                    <i class="fas fa-crown mr-2" />
                                    3rd place
                                </h5>

                                <p>
                                    <i class="fas fa-heart mr-2" />
                                    2 months of osu!supporter
                                </p>

                                <hr>

                                <small>
                                    supporter tags are for each team member
                                </small>
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

@Component
export default class Index extends Vue {

    @State user!: object;
    @State schedule!: object;

}
</script>
