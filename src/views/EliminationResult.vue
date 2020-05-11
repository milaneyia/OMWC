<template>
    <div class="container-fluid py-2">
        <page-header
            title="Elimination"
        />

        <div class="brackets">
            <div class="rounds">
                <div
                    v-for="(round, i) in rounds"
                    :key="round.id"
                    class="round"
                    :class="[
                        getRoundClass(round.id),
                        `round--${i + 1}`
                    ]"
                >
                    <div class="round__details">
                        {{ round.title }}
                        <div class="round__date">
                            {{ round.submissionsStartedAt | shortDateTimeString }} - {{ round.resultsAt | shortDateTimeString }}
                        </div>
                    </div>

                    <round-match
                        v-for="match in round.matches"
                        :key="match.id"
                        :match="match"
                        @update:select-match="selectedMatch = match"
                    />
                </div>
            </div>

            <div
                v-if="finals"
                class="rounds rounds--finals"
            >
                <div
                    v-for="(match, i) in finals.matches"
                    :key="match.id"
                    class="round round--finals"
                    :class="[
                        { 'my-5': i == 0 },
                        getRoundClass(finals.id),
                    ]"
                >
                    <i v-if="i == 0" class="fas fa-trophy fa-3x py-2" />

                    <div class="round__details">
                        {{ i == 0 ? 'final' : 'third place' }}

                        <div class="round__date">
                            {{ finals.submissionsStartedAt | shortDateTimeString }} - {{ finals.resultsAt | shortDateTimeString }}
                        </div>
                    </div>

                    <round-match
                        :match="match"
                        @update:select-match="selectedMatch = match"
                    />
                </div>
            </div>
        </div>

        <div
            v-if="selectedMatch"
            id="detailModal"
            class="modal fade"
            tabindex="-1"
        >
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ selectedMatch.teamA.name }} vs {{ selectedMatch.teamB.name }}
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
                        {{ selectedMatch.information }}

                        <hr>

                        <div
                            v-for="(eliminationJudging, i) in selectedMatch.eliminationJudging"
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

                            <hr v-if="i < selectedMatch.eliminationJudging.length - 1">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Axios from 'axios';
import Component from 'vue-class-component';
import { Round } from '../interfaces';
import PageHeader from '../components/PageHeader.vue';
import RoundMatch from '../components/RoundMatch.vue';

@Component({
    components: {
        PageHeader,
        RoundMatch,
    },
})
export default class EliminationResult extends Vue {

    allRounds: Round[] = [];
    currentRound: Round | null = null;
    selectedMatch = null;
    commentsExpanded: number[] = [];

    async created (): Promise<void> {
        const res = await Axios.get('/api/results/elimination');
        this.allRounds = res.data.rounds;
        this.currentRound = res.data.currentRound;
    }

    get rounds (): Round[] {
        if (this.allRounds.length) {
            return this.allRounds.slice(0, this.allRounds.length - 1);
        }

        return [];
    }

    get finals (): Round | null {
        if (this.allRounds.length) {
            return this.allRounds[this.allRounds.length - 1];
        }

        return null;
    }

    getRoundClass (id: number): string {
        if (!this.currentRound) return 'round--current';

        return id == this.currentRound.id ? 'round--current' : '';
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
