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
                                <a
                                    v-if="submission.originalPath"
                                    :href="`/api/admin/submissions/${submission.id}/download`"
                                >
                                    download
                                </a>
                            </td>
                            <td>
                                <input
                                    v-if="editing == submission.id"
                                    v-model="anonymisedAs"
                                    type="text"
                                    class="form-control form-control-sm"
                                    maxlength="255"
                                >

                                <span v-else>{{ submission.anonymisedAs }}</span>
                            </td>
                            <td>
                                <input
                                    v-if="editing == submission.id"
                                    type="file"
                                    class="form-control form-control-sm"
                                    maxlength="255"
                                    @change="oszFile = $event.target.files[0]"
                                >

                                <a
                                    v-else-if="submission.anonymisedPath"
                                    :href="`/api/admin/submissions/${submission.id}/downloadAnom`"
                                >
                                    download
                                </a>
                            </td>
                            <td>
                                <template v-if="editing == submission.id">
                                    <button
                                        class="btn btn-sm btn-secondary mb-2 mb-lg-0"
                                        @click="cancel"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        class="btn btn-sm btn-success"
                                        @click="save(submission)"
                                    >
                                        <div
                                            v-if="isSaving"
                                            class="spinner-border spinner-border-sm align-middle"
                                            role="status"
                                        >
                                            <span class="sr-only">Loading...</span>
                                        </div>
                                        <span v-else>Save</span>
                                    </button>
                                </template>

                                <button
                                    v-else-if="!editing"
                                    class="btn btn-sm btn-primary"
                                    @click="edit(submission.id, submission.anonymisedAs)"
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
    editing: null | number = null;
    anonymisedAs = '';
    oszFile: File | null = null;
    isSaving = false;

    async created (): Promise<void> {
        await this.getData();
    }

    async getData (): Promise<void> {
        const res = await Axios.get('/api/admin/submissions');
        this.rounds = res.data.rounds;
    }

    async save (submission: Submission): Promise<void> {
        if (!this.oszFile) {
            alert('Select an .osz');

            return;
        }

        this.isSaving = true;
        const formData = new FormData();
        formData.append('oszFile', this.oszFile);
        formData.append('anonymisedAs', this.anonymisedAs);
        const res = await Axios.post(`/api/admin/submissions/${submission.id}/save`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (res.data.success) {
            this.cancel();
            this.getData();
            alert('Saved');
        } else {
            alert(res.data.error || 'Something went wrong');
        }

        this.isSaving = false;
    }

    edit (id: number, anonymisedAs: string): void {
        this.editing = id;
        this.oszFile = null;
        this.anonymisedAs = anonymisedAs || '';
    }

    cancel (): void {
        this.editing = null;
        this.oszFile = null;
        this.anonymisedAs = '';
    }

}
</script>
