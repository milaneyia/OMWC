<template>
    <div v-if="user" class="container text-center">
        <div class="row mb-2">
            <div class="col-sm">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">
                            Hi {{ user.username }}, vote for the person who best fits the captain role for your country!
                        </h4>

                        <p>
                            You can only vote for 1 person
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div
            v-for="application in applications"
            :key="application.id"
            class="row"
        >
            <div class="col-sm">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex flex-column">
                            <div class="user-comment">
                                <div class="user-comment__user-box">
                                    <div
                                        class="avatar"
                                        :style="`background-image: url(https://a.ppy.sh/${application.user.osuId})`"
                                    />
                                    <div class="mt-1">
                                        {{ application.user.username }}
                                    </div>
                                    <button
                                        v-if="application.user.id !== user.id"
                                        class="btn btn-sm btn-block mt-2"
                                        :class="user.captainVoteId == application.id ? 'btn-danger' : 'btn-success'"
                                        @click="vote(application.id)"
                                    >
                                        <i class="fas" :class="user.captainVoteId == application.id ? 'fa-thumbs-down' : 'fa-thumbs-up'" />
                                    </button>
                                </div>
                                <div class="user-comment__divider" />
                                <div class="user-comment__comment-box">
                                    {{ application.reason }}
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
import { User } from '../../interfaces';
import Axios from 'axios';

@Component
export default class Voting extends Vue {

    @State user!: User;

    applications = [];

    async created (): Promise<void> {
        const res = await Axios.get('/api/applications/voting');
        this.applications = res.data.applications;
    }

    async vote (applicationId: number): Promise<void> {
        const res = await Axios.post('/api/applications/voting/save', {
            applicationId,
        });

        if (res.data.error) {
            alert(res.data.error);
        } else {
            const user = this.user;
            user.captainVoteId = res.data.application?.id;
            user.captainVote = res.data.application;
            this.$store.commit('updateUser', user);
            alert('Your vote was submitted!');
        }
    }

}
</script>
