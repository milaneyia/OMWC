<template>
    <div>
        <page-header
            title="Judging List"
            subtitle=" "
        >
            <p>This shows a listing of the scores you set in each entry</p>
            <div>When editing you need to add a comment for each criteria in addition to the score</div>
            <small>(if you don't save and close this window or start editing another entry, the changes will be lost!)</small>
        </page-header>
        <div class="row mb-2">
            <div class="col-sm">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">
                            {{ round.title }}
                        </h4>
                    </div>
                    <div class="card-body p-0">
                        <table class="table table-hover table-responsive-sm">
                            <thead>
                                <tr>
                                    <th class="text-left">
                                        Entry's Name
                                    </th>
                                    <th v-for="criteria in criterias" :key="criteria.id">
                                        {{ criteria.name }}
                                    </th>
                                    <th>
                                        Completed
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-if="round.matches && round.matches.length">
                                    <tr v-for="submission in round.matches[0].submissions" :key="submission.id">
                                        <td class="text-left">
                                            <a
                                                class="mr-1"
                                                :href="`api/judging/submission/${submission.id}/download`"
                                                target="_blank"
                                            >
                                                <i class="fas fa-file-download" />
                                            </a>
                                            {{ submission.anonymisedAs }}
                                        </td>
                                        <td v-for="criteria in criterias" :key="criteria.id">
                                            <a
                                                href="#"
                                                class="d-flex align-items-center justify-content-center"
                                                data-toggle="modal"
                                                data-target="#editing-judging-modal"
                                                @click.prevent="selectForEditing(submission, criteria)"
                                            >
                                                <i class="mr-1 fas fa-edit" />
                                                {{ getScore(submission.id, criteria.id) + `/ ${criteria.maxScore}` }}
                                            </a>
                                        </td>
                                        <td>
                                            <i
                                                class="fa"
                                                :class="isCompleted(submission.id) ? 'fa-check text-success' : 'fa-times text-danger'"
                                            />
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div
            v-if="editingCriteria"
            id="editing-judging-modal"
            tabindex="-1"
            class="modal fade"
            data-backdrop="static"
            data-keyboard="false"
        >
            <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
                <div class="modal-content">
                    <div
                        v-if="alertInfo"
                        class="alert"
                        :class="(alertSuccess ? 'alert-success' : 'alert-danger')"
                        role="alert"
                    >
                        {{ alertInfo }}
                    </div>
                    <div class="modal-header">
                        <h5
                            id="exampleModalLongTitle"
                            class="modal-title"
                        >
                            Editing  <b>{{ editingCriteria.name }}</b> for <b>{{ editingSubmission.anonymisedAs }}</b>
                        </h5>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="score">Score</label>
                            <input
                                id="score"
                                v-model="editingScore"
                                type="number"
                                step="1"
                                min="0"
                                :max="editingCriteria.maxScore"
                                class="form-control"
                            >
                        </div>
                        <div
                            class="form-group"
                        >
                            <label for="comment">
                                Comment
                            </label>
                            <textarea
                                id="comment"
                                v-model="editingComment"
                                maxlength="3000"
                                rows="15"
                                class="form-control"
                            />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            @click.prevent="closeModal()"
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            class="btn btn-primary"
                            @click.prevent="save()"
                        >
                            Save changes
                        </button>
                        <div id="close-button" data-dismiss="modal" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import PageHeader from '../../components/PageHeader.vue';
import Axios from 'axios';
import { QualifierJudging, QualifierJudgingToCriterias, Round, Submission, Criteria } from '../../interfaces';

@Component({
    props: {
        round: {
            type: Object,
            required: true,
        },
        criterias: {
            type: Array,
            required: true,
        },
        judgingDone: {
            type: Array,
            required: true,
        },
    },
    components: {
        PageHeader,
    },
})

export default class Qualifier extends Vue {

    judgingDone!: QualifierJudging[];
    criterias!: Criteria[];
    round!: Round;
    editingSubmission: Submission | null = null;
    editingCriteria: Criteria | null = null;
    editingScore = 0;
    editingComment = '';
    alertInfo = '';
    alertSuccess!: boolean;

    selectForEditing (submission: Submission, criteria: Criteria): void {
        this.editingSubmission = submission;
        this.editingCriteria = criteria;
        this.editingScore = 0;
        this.editingComment = '';
        this.alertInfo = '';
        this.alertSuccess = false;

        const judgingToCriterias = this.getJudgingToCriterias(submission.id, criteria.id);

        if (judgingToCriterias) {
            this.editingComment = judgingToCriterias.comment;
            this.editingScore = judgingToCriterias.score;
        }
    }

    getJudgingToCriterias(submissionId: number, criteriaId: number): QualifierJudgingToCriterias | null {
        const judging = this.judgingDone.find(j => j.submissionId === submissionId);
        if (!judging)
            return null;

        const qualifierJudgingToCriterias = judging.qualifierJudgingToCriterias.find((q) => q.criteriaId === criteriaId);
        if (!qualifierJudgingToCriterias)
            return null;

        return qualifierJudgingToCriterias;
    }

    getScore(submissionId: number, criteriaId: number): number {
        const qualifierJudgingToCriterias = this.getJudgingToCriterias(submissionId, criteriaId);
        if (!qualifierJudgingToCriterias)
            return 0;

        return qualifierJudgingToCriterias.score;
    }

    isCompleted(submissionId: number): boolean {
        const judging = this.judgingDone.find(j => j.submissionId === submissionId);
        if (!judging)
            return false;

        return judging.qualifierJudgingToCriterias.length === this.criterias.length;
    }

    async save (): Promise<void> {
        this.alertInfo = '';
        const res = await Axios.post('/api/judging/save', {
            submissionId: this.editingSubmission?.id,
            criteriaId: this.editingCriteria?.id,
            score: this.editingScore,
            comment: this.editingComment,
        });

        if (!res.data)
            return;

        const info = res.data.success || res.data.error;
        this.alertInfo = info;
        this.alertSuccess = res.data.success != undefined;

        if (!this.alertSuccess)
            return;

        const { judgingDone } = res.data;
        this.judgingDone = judgingDone;
    }

    closeModal(): void {
        document.getElementById('close-button')?.click();
    }

}
</script>
