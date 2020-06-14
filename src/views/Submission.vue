<template>
    <div v-if="user" class="container text-center">
        <page-header
            title=".osz Submissions"
        />

        <div class="row mb-2">
            <div class="col-sm">
                <div class="card">
                    <div class="card-body">
                        <table v-if="submissions" class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Round</th>
                                    <th>Submission Date</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="submission in submissions"
                                    :key="submission.id"
                                >
                                    <td> {{ submission.match.round.title }}</td>
                                    <td>
                                        {{ submission.updatedAt | shortDateTimeString }}
                                    </td>
                                    <td>
                                        <a
                                            v-if="submission.originalPath"
                                            :href="`/api/submissions/${submission.id}/download`"
                                        >
                                            download
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <template v-if="currentRound">
            <div class="row">
                <div class="col-sm">
                    <div class="card">
                        <div class="card-header">
                            <h5>
                                {{ currentRound.title }}
                            </h5>
                        </div>

                        <div class="card-body">
                            <p class="card-title">
                                {{ currentMatch.information }}
                            </p>
                            <p class="card-subtitle">
                                You have from <b><time-string :timestamp="currentRound.submissionsStartedAt" /></b> to
                                <b><time-string :timestamp="currentRound.submissionsEndedAt" /></b> to submit your entry
                            </p>

                            <hr>

                            <label>
                                .osz File (20Mb max)
                            </label>

                            <input
                                id="oszFile"
                                type="file"
                                class="form-control"
                                @change="oszFile = $event.target.files[0]"
                            >
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-sm">
                    <button class="btn btn-primary btn-block" @click="save($event)">
                        <div
                            v-if="isSaving"
                            class="spinner-border spinner-border-sm align-middle"
                            role="status"
                        >
                            <span class="sr-only">Loading...</span>
                        </div>
                        <span v-else>Save</span>
                    </button>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Axios from 'axios';
import Component from 'vue-class-component';
import { State } from 'vuex-class';
import { User, Submission as ISubmission, Match, Round } from '../interfaces';
import PageHeader from '../components/PageHeader.vue';
import TimeString from '../components/TimeString.vue';

interface ApiResponse {
    submissions: ISubmission[];
    currentRound: Round | null;
    currentMatch: Match | null;
}

@Component({
    components: {
        PageHeader,
        TimeString,
    },
})
export default class Submission extends Vue {

    @State user!: User;

    submissions: ISubmission[] = [];
    currentRound: Round | null = null;
    currentMatch: Match | null = null;
    oszFile: File | null = null;
    isSaving = false;

    async created (): Promise<void> {
        await this.getData();
    }

    async getData (): Promise<void> {
        await this.initialRequest<ApiResponse>('/api/submissions', (data) => {
            this.submissions = data.submissions,
            this.currentRound = data.currentRound,
            this.currentMatch = data.currentMatch;
        });
    }

    async save (e: Event): Promise<void> {
        if (!this.oszFile) {
            alert('Select an .osz');

            return;
        }

        (e?.target as HTMLInputElement).disabled = true;
        this.isSaving = true;
        const formData = new FormData();
        formData.append('oszFile', this.oszFile);

        try {
            const res = await Axios.post('/api/submissions/save', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data.success) {
                await this.getData();
                alert('Saved!');
            } else {
                alert(res.data.error || 'Something went wrong!');
            }
        } catch (error) {
            console.log(error);
            alert('Something went wrong');
        }

        this.isSaving = false;
        (e?.target as HTMLInputElement).disabled = false;
    }

}
</script>
