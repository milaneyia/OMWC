<template>
    <div class="container text-center">
        <page-header
            title="Submissions"
            subtitle="Listing of submissions by round, you NEED to set an anonymised name for the entry, otherwise it'll not show up for the judges"
        />

        <hr>

        <div
            v-for="round in rounds"
            :key="round.id"
            class="row mb-5"
        >
            <div class="col-sm">
                <h5 class="box py-2">
                    {{ round.title }}
                </h5>

                <div
                    v-for="match in round.matches"
                    :key="match.id"
                    class="card"
                >
                    <div class="card-header">
                        {{ match.information }}
                    </div>

                    <data-table
                        v-if="match.submissions && match.submissions.length"
                        :headers="[
                            'Team',
                            'Submission Date',
                            'Original Link',
                            'Anonymised As',
                            'Anonymised Link',
                            '',
                        ]"
                    >
                        <tr
                            v-for="submission in match.submissions"
                            :key="submission.id"
                        >
                            <td>{{ submission.country.name }}</td>
                            <td>{{ new Date(submission.updatedAt).toLocaleString() }}</td>
                            <td>
                                <a :href="submission.originalLink">
                                    {{ submission.originalLink }}
                                </a>
                            </td>
                            <td>
                                <input
                                    v-if="editing == submission.id"
                                    v-model="submission.anonymisedAs"
                                    type="text"
                                    class="form-control form-control-sm"
                                    maxlength="255"
                                >

                                <span v-else>{{ submission.anonymisedAs }}</span>
                            </td>
                            <td>
                                <input
                                    v-if="editing == submission.id"
                                    v-model="submission.anonymisedLink"
                                    type="text"
                                    class="form-control form-control-sm"
                                    maxlength="255"
                                >

                                <a v-else :href="submission.anonymisedLink">
                                    {{ submission.anonymisedLink }}
                                </a>
                            </td>
                            <td>
                                <button
                                    v-if="editing == submission.id"
                                    class="btn btn-sm btn-success"
                                    @click="save(submission)"
                                >
                                    Save
                                </button>
                                <button
                                    v-else
                                    class="btn btn-sm btn-primary"
                                    @click="editing = submission.id"
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    </data-table>

                    <div
                        v-else
                        class="card-body"
                    >
                        No submissions
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Axios from 'axios';
import PageHeader from '../../components/PageHeader.vue';
import DataTable from '../../components/DataTable.vue';
import { Submission } from '../../interfaces';

@Component({
    components: {
        PageHeader,
        DataTable,
    },
})
export default class SubmissionListing extends Vue {

    rounds = [];
    editing = null;

    async created (): Promise<void> {
        await this.getData();
    }

    async getData (): Promise<void> {
        const res = await Axios.get('/api/admin/submissions');
        this.rounds = res.data.rounds;
    }

    async save (submission: Submission): Promise<void> {
        const res = await Axios.post(`/api/admin/submissions/${submission.id}/save`, {
            anonymisedAs: submission.anonymisedAs,
            anonymisedLink: submission.anonymisedLink,
        });

        if (res.data.success) {
            this.editing = null;
            alert('Saved');
        } else {
            alert(res.data.error || 'Something went wrong');
        }
    }

}
</script>
