<template>
    <div v-if="user && !user.isRestricted && !user.isStaff && schedule" class="row mb-2">
        <div class="col-sm">
            <div class="card">
                <div class="card-body">
                    <div v-if="user.isBasicUser">
                        <button
                            v-if="!requestingAccess && !user.requestAccess"
                            class="btn btn-primary btn-block btn-lg"
                            @click="requestingAccess = true"
                        >
                            Request elevated access
                        </button>

                        <a
                            v-else-if="!requestingAccess && user.requestAccess"
                            href="#"
                            class="btn btn-secondary btn-block btn-lg disabled"
                        >
                            {{ user.requestAccess.status == 'Rejected' ? 'Your request was rejected' : `You've requested access (${user.requestAccess.mapLink})` }}
                        </a>

                        <template v-else>
                            <input
                                v-model="requestAccessLink"
                                type="text"
                                class="form-control"
                                placeholder="Link a ranked GD"
                            >

                            <button class="btn btn-primary btn-block" @click="requestAccess">
                                Request
                            </button>

                            <hr>
                        </template>
                        <p class="small mt-1">
                            You require this to apply as a captain and for voting the team captain
                        </p>
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

                            <p class="small mt-1">
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
                            to="/applications/voting"
                            class="btn btn-primary btn-block btn-lg"
                        >
                            Captain Voting
                        </router-link>

                        <p class="small mt-1">
                            from {{ new Date(schedule.captainVotingStartedAt).toLocaleString() }}
                            to {{ new Date(schedule.captainVotingEndedAt).toLocaleString() }}
                        </p>
                    </div>

                    <div v-if="schedule.mappersChoiceEndedAt && new Date(schedule.mappersChoiceEndedAt) > new Date() && user.isCaptain">
                        <router-link to="/applications/mappersChoice" class="btn btn-primary btn-block btn-lg">
                            Mappers Choice
                        </router-link>

                        <p class="small mt-1">
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
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Axios from 'axios';

@Component({
    props: {
        user: Object,
        schedule: Object,
    },
})
export default class HomeNav extends Vue {

    requestingAccess = false;
    requestAccessLink = null;

    async requestAccess(): Promise<void> {
        const res = await Axios.post('/api/users/requestAccess', {
            mapLink: this.requestAccessLink,
        });

        if (res.data.error) {
            alert(res.data.error);
        } else {
            this.requestingAccess = false;
            this.requestAccessLink = null;
            this.$store.commit('updateUser', res.data.user);
            alert('Request submitted! An admin will evaluate it soon');
        }
    }

}
</script>
