<template>
    <div>
        <page-header
            title="Judging List"
            subtitle=" "
        >
            <p>
                Listing of all the scores you set in each entry.
                You have till <b><time-string :timestamp="round.judgingEndedAt" /></b> to finish
            </p>
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
                        <a
                            :href="`/api/judging/round/${round.id}/downloadZip`"
                            target="_blank"
                        >
                            Download all entries
                        </a>
                    </div>
                    <div class="card-body p-0">
                        <table class="table table-hover table-responsive-sm">
                            <thead>
                                <tr>
                                    <th class="text-left">
                                        <a
                                            href="#"
                                            @click.prevent="sortSubmissionsBy('name')"
                                        >
                                            Entry's Name
                                        </a>
                                    </th>
                                    <th v-for="criteria in criterias" :key="criteria.id">
                                        <a
                                            href="#"
                                            @click.prevent="sortSubmissionsBy('criteria', criteria.id)"
                                        >
                                            {{ criteria.name }}
                                        </a>
                                    </th>
                                    <th>
                                        <a
                                            href="#"
                                            @click.prevent="sortSubmissionsBy('total')"
                                        >
                                            Total
                                        </a>
                                    </th>
                                    <th>
                                        <a
                                            href="#"
                                            @click.prevent="sortSubmissionsBy('completed')"
                                        >
                                            Completed
                                        </a>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="submission in sortedSubmissions" :key="submission.id">
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
                                        {{ getTotalScore(submission.id) }} / {{ maxPossibleScore }}
                                    </td>
                                    <td>
                                        <i
                                            class="fa"
                                            :class="isCompleted(submission.id) ? 'fa-check text-success' : 'fa-times text-danger'"
                                        />
                                    </td>
                                </tr>
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
import TimeString from '../../components/TimeString.vue';
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
        TimeString,
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
    sortBy = 'name';
    sortByCriteria = 1;
    sortDesc = false;

    get sortedSubmissions (): Submission[] {
        const submissions = this.round.matches[0]?.submissions;
        if (!submissions) return [];

        if (this.sortBy === 'name') {
            submissions.sort((a, b) => {
                const anomA = a.anonymisedAs?.toUpperCase();
                const anomB = b.anonymisedAs?.toUpperCase();

                if (anomA < anomB) return this.sortDesc ? -1 : 1;
                if (anomA > anomB) return this.sortDesc ? 1 : -1;

                return 0;
            });
        } else if (this.sortBy === 'total') {
            submissions.sort((a, b) => {
                const aValue = this.getTotalScore(a.id);
                const bValue = this.getTotalScore(b.id);

                if (this.sortDesc) {
                    return aValue - bValue;
                }

                return bValue - aValue;
            });
        } else if (this.sortBy === 'criteria') {
            submissions.sort((a, b) => {
                const aValue = this.getScore(a.id, this.sortByCriteria);
                const bValue = this.getScore(b.id, this.sortByCriteria);

                if (this.sortDesc) {
                    return aValue - bValue;
                }

                return bValue - aValue;
            });
        } else if (this.sortBy === 'completed') {
            submissions.sort((a, b) => {
                const aValue = this.isCompleted(a.id);
                const bValue = this.isCompleted(b.id);

                if (aValue === bValue) return 0;

                if (this.sortDesc) {
                    return aValue ? 1 : -1;
                }

                return aValue ? -1 : 1;
            });
        }

        return submissions;
    }

    get maxPossibleScore (): number {
        return this.criterias.reduce((acc, c) => c.maxScore + acc, 0);
    }

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

    getTotalScore(submissionId: number): number {
        const judging = this.judgingDone.find(j => j.submissionId === submissionId);

        if (!judging)
            return 0;

        return judging.qualifierJudgingToCriterias.reduce((acc, j) => j.score + acc, 0);
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
        this.$emit('update:judging-done', judgingDone);
    }

    closeModal(): void {
        document.getElementById('close-button')?.click();
    }

    sortSubmissionsBy (type: string, criteriaId?: number): void {
        this.sortBy = type;
        this.sortDesc = !this.sortDesc;

        if (type === 'criteria' && criteriaId) {
            this.sortByCriteria = criteriaId;
        }
    }

}
</script>
