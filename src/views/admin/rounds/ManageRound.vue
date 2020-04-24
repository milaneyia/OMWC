<template>
    <div class="container text-center">
        <page-header
            title="Manage Round"
        />

        <div class="row box py-2">
            <div class="col-sm-12">
                <div class="form-group">
                    <label>Title</label>
                    <input
                        v-model="round.title"
                        type="text"
                        class="form-control"
                        maxlength="255"
                    >
                </div>
            </div>

            <div class="col-sm-6">
                <div class="form-group">
                    <label>Submissions Start Date</label>
                    <input
                        v-model="round.submissionsStartedAt"
                        type="date"
                        class="form-control"
                    >
                </div>
            </div>

            <div class="col-sm-6">
                <div class="form-group">
                    <label>Submissions End Date</label>
                    <input
                        v-model="round.submissionsEndedAt"
                        type="date"
                        class="form-control"
                    >
                </div>
            </div>

            <div class="col-sm-6">
                <div class="form-group">
                    <label>Judging Start Date</label>
                    <input
                        v-model="round.judgingStartedAt"
                        type="date"
                        class="form-control"
                    >
                </div>
            </div>

            <div class="col-sm-6">
                <div class="form-group">
                    <label>Judging End Date</label>
                    <input
                        v-model="round.judgingEndedAt"
                        type="date"
                        class="form-control"
                    >
                </div>
            </div>

            <div class="col-sm-6">
                <div class="form-group">
                    <label>Results Date</label>
                    <input
                        v-model="round.resultsAt"
                        type="date"
                        class="form-control"
                    >
                </div>
            </div>

            <div class="col-sm-6">
                <div class="form-check">
                    <input
                        id="isQualifier"
                        v-model="round.isQualifier"
                        type="checkbox"
                        class="form-check-input"
                    >
                    <label class="form-check-label" for="isQualifier">Qualifier round</label>
                </div>
            </div>
        </div>

        <div class="row box py-2">
            <div class="col-sm-12">
                <button class="btn btn-primary btn-block" @click="save">
                    Save
                </button>

                <button class="btn btn-secondary btn-block" @click="$router.go(-1)">
                    Back
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Axios from 'axios';
import PageHeader from '../../../components/PageHeader.vue';
import DataTable from '../../../components/DataTable.vue';
import { Route } from 'vue-router';

@Component({
    components: {
        PageHeader,
        DataTable,
    },
})
export default class ManageRound extends Vue {

    emptyRound = {
        title: '',
        submissionsStartedAt: '',
        submissionsEndedAt: '',
        judgingStartedAt: '',
        judgingEndedAt: '',
        resultsAt: '',
        isQualifier: false,
    }

    round = this.emptyRound;

    async save (): Promise<void> {
        let url = '/api/admin/rounds/store';

        if (this.$route.params.id) {
            url = `/api/admin/rounds/${this.$route.params.id}/save`;
        }

        const res = await Axios.post(url, {
            round: this.round,
        });

        if (res.data.error) {
            alert(res.data.error);
        } else {
            alert('ok');
            this.$router.go(-1);
        }
    }

    async beforeRouteEnter (to: Route, from: Route, next: Function): Promise<void> {
        if (to.params.id) {
            const res = await Axios.get(`/api/admin/rounds/${to.params.id}`);
            next((vm: ManageRound) => {
                vm.round = res.data.round;
            });
        } else {
            next();
        }
    }

    async beforeRouteUpdate (to: Route, from: Route, next: Function): Promise<void> {
        if (to.params.id) {
            this.round = this.emptyRound;
            const res = await Axios.get(`/api/admin/rounds/${to.params.id}`);
            this.round = res.data.round;
        }

        next();
    }

}
</script>
