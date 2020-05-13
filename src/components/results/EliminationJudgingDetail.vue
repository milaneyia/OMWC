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
                        {{ match.teamA.name }} vs {{ match.teamB.name }}
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
                    <div
                        v-for="submission in match.submissions"
                        :key="submission.id + '-sub'"
                    >
                        <a
                            v-if="submission.originalPath"
                            :href="`/api/results/download/${submission.id}`"
                        >
                            Download {{ submission.country.name }} entry
                        </a>
                    </div>

                    {{ match.information }}

                    <hr>

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