<template>
    <div class="container text-center">
        <template v-if="user && user.isElevatedUser">
            <page-header
                title="Captain Application"
                subtitle=" "
            >
                <h5 class="mb-0">
                    You're applying for team captain for {{ user.country.name }}
                </h5>
                <small>You can apply as a mapper too from the home page!</small>
            </page-header>

            <div class="row">
                <div class="col-sm">
                    <div class="card">
                        <div class="card-body">
                            <div class="form-group">
                                <label for="reason">
                                    Tell us why
                                </label>

                                <textarea
                                    id="reason"
                                    v-model.trim="reason"
                                    rows="10"
                                    class="form-control"
                                    maxlength="3000"
                                    placeholder="Type your reasoning here"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-sm">
                    <button class="btn btn-primary btn-block" @click="apply($event)">
                        {{ user.captainApplication ? 'Update' : 'Apply' }}
                    </button>
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
export default class Captain extends Vue {

    @State user!: User;
    reason = '';

    created (): void {
        if (!this.user) {
            return;
        }

        if (!this.user.isElevatedUser) {
            this.$router.push('/');

            return;
        }

        this.reason = this.user.captainApplication?.reason || '';
    }

    async apply (e: Event): Promise<void> {
        await this.postRequest<{ captainApplication: CaptainApplication }>('/api/applications/captains/save', {
            reason: this.reason,
        }, e, (data) => {
            const user = { ...this.user };
            user.captainApplication = data.captainApplication;
            this.$store.commit('updateUser', user);
        });
    }

}
</script>
