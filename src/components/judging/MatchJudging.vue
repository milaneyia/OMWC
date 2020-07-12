<template>
    <div class="row my-2">
        <div class="col-sm">
            <div class="card">
                <div class="card-header">
                    <b>{{ matchDisplay }}</b>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-2 text-left">
                            choice: {{ submissionChosen }}
                            <div
                                v-for="submission in match.submissions"
                                :key="submission.id"
                                class="form-check"
                            >
                                <input
                                    :id="`submission${submission.id}`"
                                    v-model="submissionChosenId"
                                    :value="submission.id"
                                    type="radio"
                                    :disabled="editingMatch != match.id"
                                    class="form-check-input"
                                >
                                <label :for="`submission${submission.id}`" class="form-check-label">
                                    <a
                                        class="mr-1"
                                        :href="`api/judging/submission/${submission.id}/download`"
                                        target="_blank"
                                    >
                                        <i class="fas fa-file-download" />
                                    </a>
                                    {{ submission.anonymisedAs }}
                                </label>
                            </div>
                        </div>

                        <div class="col-sm-10">
                            <textarea
                                v-model="comment"
                                class="form-control"
                                cols="30"
                                rows="10"
                                :disabled="editingMatch != match.id"
                            />
                        </div>

                        <div class="col-sm-12 text-right mt-2">
                            <template v-if="editingMatch == match.id">
                                <button class="btn btn-success btn-sm" @click="save($event)">
                                    Save
                                </button>
                                <button class="btn btn-secondary btn-sm" @click="cancel">
                                    Cancel
                                </button>
                            </template>

                            <button
                                v-else-if="editingMatch == 0"
                                class="btn btn-primary btn-sm"
                                @click="$emit('update:editing-match', match.id)"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { EliminationJudging, Match } from '../../interfaces';

@Component({
    props: {
        match: {
            type: Object,
            required: true,
        },
        relatedJudging: {
            type: Object,
            default: null,
        },
        editingMatch: {
            type: Number,
            required: true,
        },
    },
})
export default class MatchJudging extends Vue {

    match!: Match;
    relatedJudging!: EliminationJudging | undefined;

    submissionChosenId = this.relatedJudging?.submissionChosenId || null;
    comment = this.relatedJudging?.comment || '';

    get matchDisplay (): string {
        const names = this.match.submissions?.map(s => s.anonymisedAs);
        const nameA = names?.[0] || 'x';
        const nameB = names?.[1] || 'y';

        return `${nameA} vs ${nameB}`;
    }

    get submissionChosen (): string {
        return this.match.submissions?.find(s => s.id === this.submissionChosenId)?.anonymisedAs || '';
    }

    async save (e: Event): Promise<void> {
        await this.postRequest<{ judgingDone: [] }>(`/api/judging/save`, {
            matchId: this.match.id,
            submissionChosen: this.submissionChosenId,
            comment: this.comment,
        }, e, (data) => {
            this.$emit('update:editing-match', 0);
            this.$emit('update:judging-done', data.judgingDone);
        });
    }

    cancel (): void {
        this.$emit('update:editing-match', 0);
        this.submissionChosenId = this.relatedJudging?.submissionChosenId || null;
        this.comment = this.relatedJudging?.comment || '';
    }

}
</script>
