<template>
    <div class="container-fluid py-2">
        <page-header
            title="Elimination"
        />

        <div class="brackets">
            <div class="rounds">
                <div
                    v-for="(round, i) in nonFinals"
                    :key="round.id"
                    class="round"
                    :class="[
                        getRoundClass(round.id),
                        `round--${i + 1}`
                    ]"
                >
                    <div class="round__details">
                        {{ round.title }}
                        <a
                            v-if="new Date() >= new Date(round.resultsAt)"
                            :href="`/api/results/downloadZip/${round.id}`"
                            target="_blank"
                        >
                            | Download all entries
                        </a>
                        <div class="round__date">
                            <time-string :timestamp="round.submissionsStartedAt" /> -
                            <time-string :timestamp="round.resultsAt" />
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
                            <time-string :timestamp="finals.submissionsStartedAt" /> -
                            <time-string :timestamp="finals.resultsAt" />
                        </div>
                    </div>

                    <round-match
                        :match="match"
                        @update:select-match="selectedMatch = match"
                    />
                </div>
            </div>
        </div>

        <elimination-judging-detail
            v-if="selectedMatch"
            :match="selectedMatch"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Round } from '../../interfaces';
import PageHeader from '../../components/PageHeader.vue';
import RoundMatch from '../../components/results/RoundMatch.vue';
import EliminationJudgingDetail from '../../components/results/EliminationJudgingDetail.vue';
import TimeString from '../../components/TimeString.vue';
import { State, Getter } from 'vuex-class';

@Component({
    components: {
        PageHeader,
        RoundMatch,
        EliminationJudgingDetail,
        TimeString,
    },
})
export default class EliminationResult extends Vue {

    @State eliminationRounds!: Round[];
    @State currentRound!: Round | null;
    @Getter nonFinals!: Round[];
    @Getter finals!: Round | null;
    selectedMatch = null;

    async created (): Promise<void> {
        if (!this.eliminationRounds.length || !this.currentRound) {
            await this.initialRequest('/api/results/elimination', (data) => {
                this.$store.commit('updateEliminations', data);
            });
        }
    }

    getRoundClass (id: number): string {
        if (!this.currentRound) return 'round--current';

        return id == this.currentRound.id ? 'round--current' : '';
    }

}

</script>
