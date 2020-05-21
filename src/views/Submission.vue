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
                                        {{ new Date(submission.updatedAt).toLocaleString() }}
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
                                You have from <b>{{ currentRound.submissionsStartedAt }}</b> to
                                <b>{{ currentRound.submissionsEndedAt }}</b> to submit your entry
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
                    <button class="btn btn-primary btn-block" @click="save">
                        Save
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
import { User, Submission as ISubmission, Match } from '../interfaces';
import PageHeader from '../components/PageHeader.vue';

@Component({
    components: {
        PageHeader,
    },
})
export default class Submission extends Vue {

    @State user!: User;

    submissions: ISubmission[] = [];
    currentRound = null;
    currentMatch: Match | null = null;
    oszFile!: File;

    async created (): Promise<void> {
        this.$store.commit('updateLoadingState');
        await this.getData();
        this.$store.commit('updateLoadingState');
    }

    async getData (): Promise<void> {
        const res = await Axios.get('/api/submissions');
        this.submissions = res.data.submissions;
        this.currentRound = res.data.currentRound;
        this.currentMatch = res.data.currentMatch;
    }

    async save (): Promise<void> {
        const formData = new FormData();
        formData.append('oszFile', this.oszFile);
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
    }

}
</script>
