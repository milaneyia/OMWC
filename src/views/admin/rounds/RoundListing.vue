<template>
    <div class="container text-center">
        <page-header
            title="Round Listing"
            subtitle="Listing of all rounds, once the submissions are done and you made the osz with the anonymised entries,
                you can add the link here (It'll show up for the judges and results tables)"
        />

        <router-link to="/admin/rounds/create" class="btn btn-primary btn-block my-2">
            Create
        </router-link>

        <div
            v-if="rounds"
            class="row"
        >
            <div class="col-sm">
                <div class="card">
                    <data-table
                        :headers="[
                            'Title',
                            'Submission Start',
                            'Submission End',
                            'Judging Start',
                            'Judging End',
                            'Results',
                            'Type',
                            '',
                        ]"
                    >
                        <tr
                            v-for="round in rounds"
                            :key="round.id"
                        >
                            <td>{{ round.title }}</td>
                            <td>{{ round.submissionsStartedAt }}</td>
                            <td>{{ round.submissionsEndedAt }}</td>
                            <td>{{ round.judgingStartedAt }}</td>
                            <td>{{ round.judgingEndedAt }}</td>
                            <td>{{ round.resultsAt }}</td>
                            <td>{{ round.isQualifier ? 'Qualifier' : 'Elimination' }}</td>
                            <td>
                                <router-link :to="`/admin/rounds/${round.id}`" class="btn btn-sm btn-primary">
                                    Edit Round
                                </router-link>

                                <router-link :to="`/admin/rounds/${round.id}/matches`" class="btn btn-sm btn-primary">
                                    Edit Matches
                                </router-link>
                            </td>
                        </tr>
                    </data-table>
                </div>
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
export default class RoundListing extends Vue {

    rounds = [];

    async created (): Promise<void> {
        await this.getData();
    }

    async getData (): Promise<void> {
        const res = await Axios.get('/api/admin/rounds');
        this.rounds = res.data.rounds;
    }

    async beforeRouteEnter (to: Route, from: Route, next: Function): Promise<void> {
        const res = await Axios.get(`/api/admin/rounds`);
        next((vm: RoundListing) => vm.rounds = res.data.rounds);
    }

    async beforeRouteUpdate (to: Route, from: Route, next: Function): Promise<void> {
        await this.getData();
        next();
    }

    async save (): Promise<void> {
        const res = await Axios.post('/api/admin/rounds/save', {

        });

        if (res.data.error) {
            alert(res.data.error);
        } else {
            await this.getData();
            alert('ok');
        }
    }

}
</script>
