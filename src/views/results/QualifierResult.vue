<template>
    <div class="container-lg py-2 text-center">
        <page-header
            title="Leaderboard"
        />

        <div class="row">
            <div class="col-sm">
                <div class="my-2">
                    <a
                        href="#"
                        :class="displayMode === 'criterias' ? 'border-bottom border-secondary' : ''"
                        @click="displayMode = 'criterias'"
                    >
                        Per criteria
                    </a>
                    |
                    <a
                        href="#"
                        :class="displayMode === 'judges' ? 'border-bottom border-secondary' : ''"
                        @click="displayMode = 'judges'"
                    >
                        Per judge
                    </a>
                    |
                    <a
                        href="#"
                        :class="displayMode === 'detail' ? 'border-bottom border-secondary' : ''"
                        @click="displayMode = 'detail'"
                    >
                        Std detail
                    </a>
                </div>

                <table class="leaderboard">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Team</th>
                            <template v-if="displayMode === 'criterias'">
                                <th v-for="criteria in criterias" :key="criteria.id">
                                    {{ criteria.name }}
                                </th>
                            </template>
                            <template v-else>
                                <th v-for="judge in judges" :key="judge.id">
                                    {{ judge.username }}
                                </th>
                            </template>
                            <th>Final Score (raw)</th>
                            <th>Final Score (standardized)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(score, i) in scores"
                            :key="i"
                            data-toggle="modal"
                            data-target="#detailModal"
                            @click="selectedScore = score"
                        >
                            <td>{{ i + 1 }}</td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <div class="country-flag" :style="`background-image: url(https://osu.ppy.sh/images/flags/${score.country.code}.png)`" />
                                    <div class="ml-2">
                                        {{ score.country.name }}
                                    </div>
                                </div>
                            </td>
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
                            <td>{{ score.standardizedFinalScore.toFixed(4) }}</td>
                        </tr>

                        <template v-if="displayMode === 'detail'">
                            <tr>
                                <td />
                                <td>AVG</td>
                                <td v-for="judge in judges" :key="judge.id">
                                    {{ getJudgeAvg(judge.id) }}
                                </td>
                                <td />
                                <td />
                            </tr>
                            <tr>
                                <td />
                                <td>SD</td>
                                <td v-for="judge in judges" :key="judge.id">
                                    {{ getJudgeSd(judge.id) }}
                                </td>
                                <td />
                                <td />
                            </tr>
                            <tr>
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
            v-if="selectedScore"
            :submission="scoreDetail"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Axios from 'axios';
import Component from 'vue-class-component';
import PageHeader from '../../components/PageHeader.vue';
import QualifierJudgingDetail from '../../components/results/QualifierJudgingDetail.vue';
import { Round, Country, User, Submission } from '../../interfaces';

interface TeamScore {
    country: Country;
    criteriaSum: {
        criteriaId: number;
        sum: number;
    }[];
    judgingSum: {
        judgeId: number;
        sum: number;
        standardized: number;
    }[];
    rawFinalScore: number;
    standardizedFinalScore: number;
}

interface JudgeCorrel {
    id: number;
    rawAvg: number;
    avg: number;
    sd: number;
    correl: number;
}

@Component({
    components: {
        PageHeader,
        QualifierJudgingDetail,
    },
})
export default class QualifierResult extends Vue {

    criterias = [];
    judges: User[] = [];
    round: Round | null = null;
    selectedScore: TeamScore | null = null;
    displayMode = 'criterias';
    judgesCorrel: JudgeCorrel[] = [];

    async created (): Promise<void> {
        await this.getData();
    }

    async getData (): Promise<void> {
        const res = await Axios.get('/api/results/qualifiers');
        this.criterias = res.data.criterias;
        this.judges = res.data.judges;
        this.round = res.data.round;
    }

    get scoreDetail (): Submission | undefined {
        if (this.selectedScore) {
            return this.round?.matches[0].submissions?.find(s => s.country.id == this.selectedScore?.country.id);
        }

        return undefined;
    }

    get scores (): TeamScore[] {
        const teamsScores: TeamScore[] = [];
        const judgesCorrel: JudgeCorrel[] = [];

        if (this.round?.matches.length) {
            const submissions = this.round.matches[0].submissions;

            if (submissions) {
                for (const submission of submissions) {
                    const teamScore: TeamScore = {
                        country: submission.country,
                        criteriaSum: [],
                        judgingSum: [],
                        rawFinalScore: 0,
                        standardizedFinalScore: 0,
                    };

                    for (const qualifierJudging of submission.qualifierJudging) {
                        let judgeSum = 0;

                        for (const judgingToCriteria of qualifierJudging.qualifierJudgingToCriterias) {
                            judgeSum += judgingToCriteria.score;
                            const i = teamScore.criteriaSum.findIndex(j => j.criteriaId === judgingToCriteria.criteriaId);

                            if (i !== -1) {
                                teamScore.criteriaSum[i].sum += judgingToCriteria.score;
                            } else {
                                teamScore.criteriaSum.push({
                                    criteriaId: judgingToCriteria.criteriaId,
                                    sum: judgingToCriteria.score,
                                });
                            }
                        }

                        teamScore.judgingSum.push({
                            judgeId: qualifierJudging.judgeId,
                            sum: judgeSum,
                            standardized: 0,
                        });
                    }

                    teamScore.rawFinalScore = teamScore.criteriaSum.reduce((acc, c) => acc + c.sum, 0);
                    teamsScores.push(teamScore);
                }

            }
        }

        if (teamsScores.length) {
            const judgesIds = this.judges.map(j => j.id);

            for (const judgeId of judgesIds) {
                let judgeSum = 0;
                let judgeAvg = 0;
                let judgeSd = 0;
                let judgeStdSum = 0;

                // Get score avg for the current judge
                for (const teamScore of teamsScores) {
                    judgeSum += teamScore.judgingSum.find(j => j.judgeId === judgeId)?.sum || 0;
                }

                judgeAvg = judgeSum / teamsScores.length;

                // Get SD for the current judge
                for (const teamScore of teamsScores) {
                    const judgingSum = teamScore.judgingSum.find(j => j.judgeId === judgeId);

                    if (judgingSum) {
                        judgeSd += Math.pow(judgingSum.sum - judgeAvg, 2);
                    }
                }

                judgeSd = Math.sqrt(judgeSd / teamsScores.length);

                // Set standard score for each entry for the current judge
                for (let i = 0; i < teamsScores.length; i++) {
                    const j = teamsScores[i].judgingSum.findIndex(j => j.judgeId === judgeId);

                    if (j !== -1) {
                        // S* = S - S(avg) / SD
                        const stdScore = (teamsScores[i].judgingSum[j].sum - judgeAvg) / judgeSd;
                        teamsScores[i].standardizedFinalScore += stdScore;
                        teamsScores[i].judgingSum[j].standardized = stdScore;
                        judgeStdSum += stdScore || 0;
                    }
                }

                // Set standard score average for the current judge
                judgesCorrel.push({
                    id: judgeId,
                    rawAvg: judgeAvg,
                    avg: judgeStdSum / teamsScores.length,
                    sd: judgeSd,
                    correl: 0,
                });
            }

            // Get final standard scores average
            const totalStdAvg = teamsScores.reduce((acc, s) => acc + s.standardizedFinalScore, 0) / teamsScores.length;

            // Set correlation coefficient per judge
            for (const judgeId of judgesIds) {
                const i = judgesCorrel.findIndex(j => j.id === judgeId);
                const judgeAvg = judgesCorrel[i]?.avg || 0;

                let sum1 = 0;
                let sum2 = 0;
                let sum3 = 0;

                for (const teamScore of teamsScores) {
                    const judgingSum = teamScore.judgingSum.find(j => j.judgeId === judgeId);

                    if (judgingSum) {
                        const x = (judgingSum.standardized - judgeAvg);
                        const y = (teamScore.standardizedFinalScore - totalStdAvg);
                        sum1 += x * y;
                        sum2 += Math.pow(x, 2);
                        sum3 += Math.pow(y, 2);
                    }
                }

                judgesCorrel[i].correl = sum1 / (Math.sqrt(sum2 * sum3));
            }
        }

        this.judgesCorrel = judgesCorrel;
        teamsScores.sort((a, b) => b.standardizedFinalScore - a.standardizedFinalScore);

        return teamsScores;
    }

    getCriteriaScore (score: TeamScore, criteriaId: number): number {
        return score.criteriaSum.find(c => c.criteriaId === criteriaId)?.sum || 0;
    }

    getJudgeScore (score: TeamScore, judgeId: number, std = false): number | string {
        const judgeScore = score.judgingSum.find(j => j.judgeId === judgeId);

        if (std) {
            return `${judgeScore?.sum || 0} (${judgeScore?.standardized.toFixed(3) || 0})`;
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
        return this.judgesCorrel.find(j => j.id === id)?.correl.toFixed(4) || 0;
    }

}
</script>
