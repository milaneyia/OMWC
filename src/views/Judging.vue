<template>
    <div class="container text-center">
        <div class="row mb-2">
            <div class="col-sm">
                <div class="card">
                    <div class="card-header">
                        <p>This shows a listing of the scores you set in each entry</p>
                        <div>When editing you need to add a comment for each criteria in addition to the score</div>
                        <small>(if you don't save and close this window or start editing another entry, the changes'll be lost!)</small>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mb-2">
            <div class="col-sm">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">
                            {{ currentRound.title }}
                        </h4>
                        <a :href="currentRound.anonymisedLink" class="card-subtitle">
                            Download .osz
                        </a>
                    </div>
                    <div class="card-body p-0">
                        <table class="table table-hover table-responsive-sm">
                            <thead>
                                <tr>
                                    <th>Entry's Name</th>
                                    <th v-for="criteria in criterias" :key="criteria.id">
                                        | {{ criteria.name }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="submission in currentRound.submissions" :key="submission.id">
                                    <td>{{ submission.anonymisedAs }}</td>
                                    <td v-for="criteria in criterias" :key="criteria.id">
                                        <a href="#" class="d-flex align-items-center justify-content-center" @click.prevent="selectToEdit(submission, criteria)">
                                            <i
                                                class="small mr-1 fas"
                                                :class="(editingJudging.submissionId === submission.id && editingJudging.judgingCriteriaId === criteria.id) ? 'fa-expand' : 'fa-edit'"
                                            >
                                                {{ getScore(submission.id, criteria.id) }}
                                            </i>
                                            b.text-danger.ml-1(v-if="wasModified(submission.id, criteria.id)") *
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="editingJudging && editingJudging.submissionId" class="row mb-2">
            <div class="col-sm">
                <div class="card">
                    <div class="card-header">
                        Editing <b>{{ selectedCriteria.name }}</b> for <b>{{ selectedSubmission.anonymisedAs }}</b>
                        <b v-if="wasModified(selectedSubmission.id, selectedCriteria.id)" class="text-danger ml-1">*</b>
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <label for="score">Score</label>
                            <input
                                id="score"
                                v-model.number="editingJudging.score"
                                type="number"
                                step=".01"
                                class="form-control"
                            >
                        </div>
                        <div class="form-group">
                            <label for="comment">Comment</label>
                            <textarea
                                id="comment"
                                v-model.trim="editingJudging.comment"
                                maxlength="3000"
                                rows="3"
                                class="form-control"
                            />
                        </div>
                        <button class="btn btn-primary btn-block" type="button" @click="save()">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-sm">
                <p>{{ info }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import { Judging, JudgingCriteria, Submission } from '../interfaces';

export default Vue.extend({
    props: {
        currentRoundProp: Object,
        judgingDoneProp: Array as () => Judging[],
        criterias: Array as () => JudgingCriteria[],
    },
    data () {
        return {
            currentRound: this.currentRoundProp || {},
            judgingDone: this.judgingDoneProp || [],
            selectedSubmission: {} as Submission,
            selectedCriteria: {} as JudgingCriteria,
            editingJudging: {} as Judging,
            initialEditingJudging: {} as Judging,
            info: null,
        };
    },
    methods: {
        selectToEdit (submission: Submission, criteria: JudgingCriteria) {
            this.selectedSubmission = submission;
            this.selectedCriteria = criteria;

            const judgingToEdit = this.judgingDone.find(j => j.submissionId === submission.id && j.judgingCriteriaId === criteria.id);
            this.initialEditingJudging = {
                submissionId: submission.id,
                judgingCriteriaId: criteria.id,
                score: judgingToEdit && judgingToEdit.score,
                comment: judgingToEdit && judgingToEdit.comment,
            };
            this.editingJudging = { ...this.initialEditingJudging };
        },
        wasModified (submissionId: number, criteriaId: number): boolean {
            if (this.editingJudging.submissionId === submissionId && this.editingJudging.judgingCriteriaId === criteriaId) {
                return this.initialEditingJudging.score !== this.editingJudging.score || this.initialEditingJudging.comment !== this.editingJudging.comment;
            }

            return false;
        },
        getScore (submissionId: number, criteriaId: number): number|undefined {
            const judging = this.judgingDone.find(j => j.judgingCriteriaId === criteriaId && j.submissionId === submissionId);

            return (judging && judging.score);
        },
        async save () {
            const res = await axios.post('/judging/save', {
                submissionId: this.selectedSubmission.id,
                criteriaId: this.selectedCriteria.id,
                score: this.editingJudging.score,
                comment: this.editingJudging.comment,
            });

            if (res.data) {
                this.info = res.data.success || res.data.error;

                if (res.data.success) {
                    const savedJuging: Judging = res.data.judging;
                    const i = this.judgingDone.findIndex(j => j.id === savedJuging.id);

                    if (i !== -1) {
                        this.judgingDone[i].score = savedJuging.score;
                        this.judgingDone[i].comment = savedJuging.comment;
                    } else {
                        this.judgingDone.push(savedJuging);
                    }

                    this.editingJudging.score = savedJuging.score;
                    this.editingJudging.comment = savedJuging.comment;
                    this.initialEditingJudging.score = savedJuging.score;
                    this.initialEditingJudging.comment = savedJuging.comment;
                }
            }
        },
    },
});
</script>