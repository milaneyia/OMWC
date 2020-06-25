<template>
    <div class="container text-center">
        <page-header
            title="Submissions"
            subtitle="Listing of submissions by round, you NEED to set an anonymised name and upload the .osz for the entry, otherwise it'll not show up for the judges"
        >
            <select v-model="selectedRoundId" class="form-control mt-3">
                <option
                    v-for="round in rounds"
                    :key="round.id"
                    :value="round.id"
                >
                    {{ round.title }}
                </option>
            </select>

            <button class="btn btn-sm btn-primary mt-2 mx-1" @click="generateZip($event)">
                Generate zip (from originals osz)
            </button>
            <a
                :href="`/api/admin/rounds/${selectedRoundId}/downloadZip`"
                class="btn btn-sm btn-primary mt-2 mx-1"
                target="_blank"
            >
                Download original
            </a>

            <button class="btn btn-sm btn-primary mt-2 mx-1" @click="generateAnomZip($event)">
                Generate zip (from anonymised osz for judges)
            </button>

            <a
                :href="`/api/admin/rounds/${selectedRoundId}/downloadAnomZip`"
                class="btn btn-sm btn-primary mt-2 mx-1"
                target="_blank"
            >
                Download anom
            </a>
        </page-header>

        <template v-if="selectedRound">
            <div
                v-for="match in selectedRound.matches"
                :key="match.id"
                class="card my-2"
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
                        <country-flag-cell :country="submission.country" />
                        <td>{{ submission.updatedAt | shortDateTimeString }}</td>
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
        </template>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Axios from 'axios';
import PageHeader from '../../components/PageHeader.vue';
import DataTable from '../../components/admin/DataTable.vue';
import CountryFlagCell from '../../components/CountryFlagCell.vue';
import { Submission, Round } from '../../interfaces';

@Component({
    components: {
        PageHeader,
        DataTable,
        CountryFlagCell,
    },
})
export default class SubmissionListing extends Vue {

    rounds: Round[] = [];
    editing: null | number = null;
    anonymisedAs = '';
    oszFile: File | null = null;
    isSaving = false;
    selectedRoundId = 1;

    async created (): Promise<void> {
        await this.getData();
    }

    get selectedRound (): Round | undefined {
        return this.rounds.find(r => r.id === this.selectedRoundId);
    }

    async getData (): Promise<void> {
        await this.initialRequest<{ rounds: [] }>('/api/admin/submissions', (data) => {
            this.rounds = data.rounds;
        });
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

    async generateZip (e: Event): Promise<void> {
        await this.postRequest(`/api/admin/rounds/${this.selectedRoundId}/generateZip`, {
            type: 'original',
        }, e);
    }

    async generateAnomZip (e: Event): Promise<void> {
        await this.postRequest(`/api/admin/rounds/${this.selectedRoundId}/generateZip`, {
            type: 'anom',
        }, e);
    }

}
</script>
