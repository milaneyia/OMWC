<template>
    <div v-if="user && !user.isRestricted && !user.isStaff && schedule" class="row mb-2">
        <div class="col-sm">
            <div class="card">
                <div class="card-body">
                    <!-- Access request -->
                    <div v-if="user.isBasicUser && !hasCaptainVotingEnded">
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

                    <div v-if="!hasApplicationsEnded">
                        <!-- Captain app -->
                        <div v-if="user.isElevatedUser">
                            <router-link
                                to="/applications/captains"
                                class="btn btn-block btn-lg"
                                :class="getStateClassButton(schedule.applicationsStartedAt)"
                            >
                                {{ user.captainApplication ? 'Edit your team captain application' : 'Apply for team captain' }}
                            </router-link>

                            <p class="small">
                                {{ applicationsDateText }}
                            </p>
                        </div>

                        <!-- Mapper app -->
                        <a
                            v-if="user.mapperApplication"
                            href="#"
                            class="btn btn-secondary disabled btn-block btn-lg"
                        >
                            You've applied as a mapper
                        </a>

                        <template v-else>
                            <router-link
                                to="/applications/mappers/"
                                class="btn btn-block btn-lg"
                                :class="getStateClassButton(schedule.applicationsStartedAt)"
                            >
                                Apply as a mapper
                            </router-link>

                            <p class="small mt-1">
                                {{ applicationsDateText }}
                            </p>
                        </template>

                        <hr>
                    </div>

                    <!-- Captain voting -->
                    <div v-if="user.isElevatedUser && !hasCaptainVotingEnded">
                        <router-link
                            to="/applications/voting"
                            class="btn btn-block btn-lg"
                            :class="getStateClassButton(schedule.captainVotingStartedAt)"
                        >
                            Captain Voting
                        </router-link>

                        <p class="small mt-1">
                            {{ votingDateText }}
                        </p>
                    </div>

                    <template v-if="user.isCaptain">
                        <!-- Mappers' choice -->
                        <div v-if="!hasMappersChoiceEnded">
                            <router-link
                                to="/applications/mappersChoice"
                                class="btn btn-block btn-lg"
                                :class="getStateClassButton(schedule.mappersChoiceStartedAt)"
                            >
                                Mappers' Choice
                            </router-link>

                            <p class="small mt-1">
                                {{ mappersChoiceDateText }}
                            </p>
                        </div>

                        <!-- Osz submission -->
                        <router-link
                            v-else
                            to="/submissions"
                            class="btn btn-primary btn-block btn-lg"
                        >
                            .osz submissions
                        </router-link>
                    </template>

                    <!-- Judging -->
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
import { Schedule } from '../interfaces';

@Component({
    props: {
        user: Object,
        schedule: Object,
    },
})
export default class HomeNav extends Vue {

    requestingAccess = false;
    requestAccessLink = null;
    schedule!: Schedule;

    get hasApplicationsEnded (): boolean {
        return this.schedule.applicationsEndedAt && new Date(this.schedule.applicationsEndedAt) < new Date();
    }

    get hasCaptainVotingEnded (): boolean {
        return this.schedule.captainVotingEndedAt && new Date(this.schedule.captainVotingEndedAt) < new Date();
    }

    get hasMappersChoiceEnded (): boolean {
        return this.schedule.mappersChoiceEndedAt && new Date(this.schedule.mappersChoiceEndedAt) < new Date();
    }

    get applicationsDateText (): string {
        return `from ${new Date(this.schedule.applicationsStartedAt).toLocaleString()}
                to ${new Date(this.schedule.applicationsEndedAt).toLocaleString() }`;
    }

    get votingDateText (): string {
        return `from ${new Date(this.schedule.captainVotingStartedAt).toLocaleString()}
                to ${new Date(this.schedule.captainVotingEndedAt).toLocaleString() }`;
    }

    get mappersChoiceDateText (): string {
        return `from ${new Date(this.schedule.mappersChoiceStartedAt).toLocaleString()}
                to ${new Date(this.schedule.mappersChoiceEndedAt).toLocaleString() }`;
    }

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

    getStateClassButton (startedAt: Date | undefined): string {
        return !startedAt || (startedAt && new Date(startedAt) > new Date()) ? 'disabled btn-secondary' : 'btn-primary';
    }

}
</script>
