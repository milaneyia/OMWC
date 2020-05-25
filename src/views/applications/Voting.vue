<template>
    <div class="container text-center">
        <template v-if="user && user.isElevatedUser">
            <page-header
                title="Captain Voting"
                subtitle=" "
            >
                <h5>
                    Vote for the person who best fits the captain role for your country!
                </h5>

                <p>
                    You can only vote for 1 person
                </p>
            </page-header>

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
                                            @click="vote(application.id, $event)"
                                        >
                                            {{ user.captainVoteId == application.id ? 'Cancel vote' : 'Vote' }}
                                        </button>
                                    </div>
                                    <div class="user-comment__divider" />
                                    <div class="user-comment__comment-box">
                                        <span>{{ application.reason }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="!applications.length && wasLoaded">
                <div class="row">
                    <div class="col-sm">
                        <div class="card">
                            <div class="card-body">
                                Noone applied :(
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <login-modal v-else-if="!user" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { State } from 'vuex-class';
import { User, CaptainApplication } from '../../interfaces';
import PageHeader from '../../components/PageHeader.vue';
import LoginModal from '../../components/LoginModal.vue';

@Component({
    components: {
        PageHeader,
        LoginModal,
    },
})
export default class Voting extends Vue {

    @State user!: User;

    wasLoaded = false;
    applications = [];

    async created (): Promise<void> {
        if (!this.user) {
            return;
        }

        if (!this.user.isElevatedUser) {
            this.$router.push('/');

            return;
        }

        await this.initialRequest<{ applications: [] }>('/api/applications/voting', (data) => {
            this.applications = data.applications;
            this.wasLoaded = true;
        });
    }

    async vote (applicationId: number, e: Event): Promise<void> {
        await this.postRequest<{ application: CaptainApplication | undefined }>('/api/applications/voting/save', {
            applicationId,
        }, e, (data) => {
            const user = this.user;
            user.captainVoteId = data.application?.id;
            user.captainVote = data.application;
            this.$store.commit('updateUser', user);
            alert('Your vote was submitted!');
        });
    }

}
</script>
