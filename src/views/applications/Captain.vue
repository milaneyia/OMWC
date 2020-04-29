<template>
    <div v-if="user" class="container text-center">
        <page-header
            title="Captain Application"
            subtitle=" "
        >
            <h5 class="mb-0">
                You're applying for team captain for {{ user.country.name }}
            </h5>
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
                                v-model="reason"
                                rows="10"
                                class="form-control"
                                maxlength="3000"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-sm">
                <button class="btn btn-primary btn-block" @click="apply">
                    {{ user.captainApplication ? 'Update' : 'Apply' }}
                </button>
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
import PageHeader from '../../components/PageHeader.vue';

@Component({
    components: {
        PageHeader,
    },
})
export default class Index extends Vue {

    @State user!: User;
    reason = '';

    created (): void {
        if (this.user?.captainApplication) {
            this.reason = this.user.captainApplication.reason;
        }
    }

    async apply (): Promise<void> {
        const res = await Axios.post('/api/applications/captains/save', {
            reason: this.reason,
        });

        if (res.data.success) {
            const user = { ...this.user };
            user.captainApplication = res.data.captainApplication;
            this.$store.commit('updateUser', user);
            this.$router.push('/');
        } else {
            alert(res.data.error || 'Something went wrong!');
        }
    }

}
</script>
