<template>
    <div
        id="detailModal"
        class="modal fade"
        tabindex="-1"
    >
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        {{ matchDisplay }}
                    </h5>
                    <button
                        type="button"
                        class="close"
                        data-dismiss="modal"
                    >
                        &times;
                    </button>
                </div>

                <div class="modal-body text-left">
                    {{ match.information }}

                    <div
                        v-for="(eliminationJudging, i) in match.eliminationJudging"
                        :key="eliminationJudging.id"
                    >
                        <a
                            data-toggle="collapse"
                            :href="`#eliminationJudging${eliminationJudging.id}`"
                            @click="showComment(eliminationJudging.id)"
                        >
                            <small>
                                <i
                                    class="fas mr-2"
                                    :class="getCollapseClass(eliminationJudging.id)"
                                />
                            </small>
                            {{ eliminationJudging.judge.username }}
                            <b>({{ eliminationJudging.submissionChosen.country.name }})</b>:
                        </a>

                        <p
                            :id="`eliminationJudging${eliminationJudging.id}`"
                            class="text-light ml-3 collapse"
                        >
                            <span style="white-space: pre-line;">{{ eliminationJudging.comment }}</span>
                        </p>

                        <hr v-if="i < match.eliminationJudging.length - 1">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Match } from '../../interfaces';

@Component({
    props: {
        match: {
            type: Object,
            required: true,
        },
    },
})
export default class EliminationJudgingDetail extends Vue {

    commentsExpanded: number[] = [];
    match!: Match;

    get matchDisplay (): string {
        const nameA = this.match.submissions?.find(s => s.country.id === this.match.teamAId)?.anonymisedAs || 'x';
        const nameB = this.match.submissions?.find(s => s.country.id === this.match.teamBId)?.anonymisedAs || 'x';

        return `${this.match.teamA?.name} vs ${this.match.teamB?.name} (${nameA} vs ${nameB})`;
    }

    showComment (id: number): void {
        const i = this.commentsExpanded.findIndex(j => j === id);
        i !== -1 ? this.commentsExpanded.splice(i, 1) : this.commentsExpanded.push(id);
    }

    getCollapseClass (id: number): string {
        if (this.commentsExpanded.includes(id)) {
            return 'fa-chevron-down';
        }

        return 'fa-chevron-right';
    }

}
</script>