<template>
    <div>
        <div class="row">
            <div class="col-sm-12">
                <b>{{ matchDisplay }}</b>
            </div>

            <div class="col-sm-2">
                choice:
                <div
                    v-for="submission in match.submissions"
                    :key="submission.id"
                    class="form-check"
                >
                    <input
                        :id="`submission${submission.id}`"
                        v-model="submissionChosen"
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
        <hr>
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

    submissionChosen = this.relatedJudging?.submissionChosenId || null;
    comment = this.relatedJudging?.comment || '';

    get matchDisplay (): string {
        const names = this.match.submissions?.map(s => s.anonymisedAs);
        const nameA = names?.[0] || 'x';
        const nameB = names?.[1] || 'y';

        return `${nameA} vs ${nameB}`;
    }

    async save (e: Event): Promise<void> {
        await this.postRequest<{ judgingDone: [] }>(`/api/judging/save`, {
            matchId: this.match.id,
            submissionChosen: this.submissionChosen,
            comment: this.comment,
        }, e, (data) => {
            this.$emit('update:editing-match', 0);
            this.$emit('update:judging-done', data.judgingDone);
        });
    }

    cancel (): void {
        this.$emit('update:editing-match', 0);
        this.submissionChosen = this.relatedJudging?.submissionChosenId || null;
        this.comment = this.relatedJudging?.comment || '';
    }

}
</script>
