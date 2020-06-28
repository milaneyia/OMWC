<template>
    <div>
        <div class="row my-3">
            <div class="col-sm">
                <a
                    href="#"
                    :class="displayMode === 'criterias' ? 'border-bottom border-secondary' : ''"
                    @click.prevent="displayMode = 'criterias'"
                >
                    Per criteria
                </a>
                |
                <a
                    href="#"
                    :class="displayMode === 'judges' ? 'border-bottom border-secondary' : ''"
                    @click.prevent="displayMode = 'judges'"
                >
                    Per judge
                </a>
                |
                <a
                    href="#"
                    :class="displayMode === 'detail' ? 'border-bottom border-secondary' : ''"
                    @click.prevent="displayMode = 'detail'"
                >
                    Std detail
                </a>
                <template v-if="qualifier && new Date() >= new Date(qualifier.resultsAt)">
                    |
                    <a

                        :href="`/api/results/downloadZip/${qualifier.id}`"
                        target="_blank"
                    >
                        Download all entries
                    </a>
                </template>
            </div>
        </div>
        <div class="row">
            <div class="col-sm">
                <table
                    class="leaderboard"
                    :class="submissionsLength ? 'leaderboard--clickable' : ''"
                >
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Team</th>
                            <template v-if="displayMode === 'criterias'">
                                <th
                                    v-for="criteria in criterias"
                                    :key="criteria.id"
                                >
                                    <a
                                        href="#"
                                        @click.prevent="sortByCriteria(criteria.id)"
                                    >
                                        {{ criteria.name }}
                                    </a>
                                </th>
                            </template>
                            <template v-else>
                                <th
                                    v-for="judge in judges"
                                    :key="judge.id"
                                >
                                    <a
                                        href="#"
                                        @click.prevent="sortByJudge(judge.id)"
                                    >
                                        {{ judge.username }}
                                    </a>
                                </th>
                            </template>
                            <th>
                                <a
                                    href="#"
                                    @click.prevent="sortByRawScore"
                                >
                                    Final Score (raw)
                                </a>
                            </th>
                            <th>
                                <a
                                    href="#"
                                    @click.prevent="sortByStdScore"
                                >
                                    Final Score (standardized)
                                </a>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(score, i) in teamsScores"
                            :key="i"
                            data-toggle="modal"
                            data-target="#detailModal"
                            :style="i > 15 ? 'opacity: .7' : ''"
                            @click="selectedScore = score"
                        >
                            <td>{{ i + 1 }}</td>
                            <country-flag-cell :country="score.country" />
                            <template v-if="displayMode === 'criterias'">
                                <td v-for="criteria in criterias" :key="criteria.id">
                                    {{ getCriteriaScore(score, criteria.id) }}
                                </td>
                            </template>
                            <template v-else>
                                <td v-for="judge in judges" :key="judge.id">
                                    {{ getJudgeScore(score, judge.id, displayMode === 'detail') }}
                                </td>
                            </template>

                            <td>{{ score.rawFinalScore }}</td>
                            <td>{{ getFinalScore(score.standardizedFinalScore) }}</td>
                        </tr>

                        <template v-if="displayMode === 'detail'">
                            <tr class="cursor-default">
                                <td />
                                <td>AVG</td>
                                <td v-for="judge in judges" :key="judge.id">
                                    {{ getJudgeAvg(judge.id) }}
                                </td>
                                <td />
                                <td />
                            </tr>
                            <tr class="cursor-default">
                                <td />
                                <td>SD</td>
                                <td v-for="judge in judges" :key="judge.id">
                                    {{ getJudgeSd(judge.id) }}
                                </td>
                                <td />
                                <td />
                            </tr>
                            <tr class="cursor-default">
                                <td />
                                <td>COR</td>
                                <td v-for="judge in judges" :key="judge.id">
                                    {{ getJudgeCorrel(judge.id) }}
                                </td>
                                <td />
                                <td />
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>

        <qualifier-judging-detail
            v-if="submissionsLength && selectedScore"
            :submission="scoreDetail"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import PageHeader from '../../components/PageHeader.vue';
import CountryFlagCell from '../../components/CountryFlagCell.vue';
import QualifierJudgingDetail from '../../components/results/QualifierJudgingDetail.vue';
import TimeString from '../../components/TimeString.vue';
import { Round, User, Submission } from '../../interfaces';
import { TeamScore, JudgeCorrel } from '../../../app/helpers';
import { State, Getter } from 'vuex-class';

@Component({
    components: {
        PageHeader,
        QualifierJudgingDetail,
        CountryFlagCell,
        TimeString,
    },
})
export default class QualifierLeaderboard extends Vue {

    @State criterias!: [];
    @State judges!: User[];
    @State qualifier!: Round | null;
    @State teamsScores!: TeamScore[];
    @State judgesCorrel!: JudgeCorrel[];
    @Getter submissionsLength!: number | undefined;

    selectedScore: TeamScore | null = null;
    displayMode: 'criterias' | 'judges' | 'detail' = 'criterias';
    sortDesc = false;

    get scoreDetail (): Submission | undefined {
        if (this.selectedScore) {
            return this.qualifier?.matches?.[0]?.submissions?.find(s => s.country.id == this.selectedScore?.country.id);
        }

        return undefined;
    }

    getCriteriaScore (score: TeamScore, criteriaId: number): number {
        return score.criteriaSum.find(c => c.criteriaId === criteriaId)?.sum || 0;
    }

    getJudgeScore (score: TeamScore, judgeId: number, std = false): number | string {
        const judgeScore = score.judgingSum.find(j => j.judgeId === judgeId);
        const stdScore = judgeScore?.standardized || 0;

        if (std) {
            return `${judgeScore?.sum || 0} (${stdScore.toFixed(3)})`;
        }

        return judgeScore?.sum || 0;
    }

    getJudgeAvg (id: number): number | string {
        return this.judgesCorrel.find(j => j.id === id)?.rawAvg.toFixed(4) || 0;
    }

    getJudgeSd (id: number): number | string {
        return this.judgesCorrel.find(j => j.id === id)?.sd.toFixed(4) || 0;
    }

    getJudgeCorrel (id: number): number | string {
        const correl = this.judgesCorrel.find(j => j.id === id)?.correl || 0;

        return correl.toFixed(4);
    }

    getFinalScore (standardizedFinalScore: number): string {
        return isNaN(standardizedFinalScore) ? '0' : standardizedFinalScore.toFixed(4);
    }

    sortByCriteria (criteriaId: number): void {
        this.sortDesc = !this.sortDesc;

        this.$store.commit('sortByCriteria', {
            criteriaId,
            sortDesc: this.sortDesc,
        });
    }

    sortByJudge (judgeId: number): void {
        this.sortDesc = !this.sortDesc;

        this.$store.commit('sortByJudge', {
            judgeId,
            sortDesc: this.sortDesc,
        });
    }

    sortByRawScore (): void {
        this.sortDesc = !this.sortDesc;

        this.$store.commit('sortByRawScore', {
            sortDesc: this.sortDesc,
        });

    }

    sortByStdScore (): void {
        this.sortDesc = !this.sortDesc;

        this.$store.commit('sortByStdScore', {
            sortDesc: this.sortDesc,
        });
    }

}
</script>

<style lang="scss" scoped>

.cursor-default td {
    cursor: default;
}

</style>