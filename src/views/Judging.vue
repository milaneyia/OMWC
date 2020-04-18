<template lang="pug">
    .container.text-center
        .row.mb-2
            .col-sm
                .card
                    .card-header
                        p This shows a listing of the scores you set in each entry
                        div When editing you need to add a comment for each criteria in addition to the score
                        small (if you don't save and close this window or start editing another entry, the changes'll be lost!)

        .row.mb-2
            .col-sm
                .card
                    .card-header
                        h4.card-title {{ currentRound.title }}
                        a.card-subtitle(:href="currentRound.anonymisedLink") Download .osz
                    .card-body.p-0
                        table.table.table-hover.table-responsive-sm
                            thead
                                tr
                                    th Entry's Name
                                    th(v-for="criteria in criterias" :key="criteria.id")
                                        | {{ criteria.name }}

                            tbody
                                tr(v-for="submission in currentRound.submissions" :key="submission.id")
                                    td {{ submission.anonymisedAs }}
                                    td(v-for="criteria in criterias" :key="criteria.id")
                                        a.d-flex.align-items-center.justify-content-center(href="#" @click.prevent="selectToEdit(submission, criteria)")
                                            i.small.mr-1.fas(
                                                :class="(editingJudging.submissionId === submission.id && editingJudging.judgingCriteriaId === criteria.id) ? 'fa-expand' : 'fa-edit'"
                                            )
                                            | {{ getScore(submission.id, criteria.id) }}
                                            b.text-danger.ml-1(v-if="wasModified(submission.id, criteria.id)") *

        .row.mb-2(v-if="editingJudging && editingJudging.submissionId")
            .col-sm
                .card
                    .card-header
                        | Editing #[b {{ selectedCriteria.name }}] for #[b {{ selectedSubmission.anonymisedAs }}]
                        b.text-danger.ml-1(v-if="wasModified(selectedSubmission.id, selectedCriteria.id)") *
                    .card-body
                        .form-group
                            label Score
                            input.form-control(type="number" step=".01" v-model.number="editingJudging.score")

                        .form-group
                            label Comment
                            textarea.form-control(maxlength="3000" rows="3" v-model.trim="editingJudging.comment")

                        button.btn.btn-primary.btn-block(type="button" @click="save()")
                            | Save

        .row
            .col-sm
                p {{ info }}

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