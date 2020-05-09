<template>
    <div class="container-lg text-center">
        <page-header
            title="Leaderboard"
        />

        <div class="row">
            <div class="col-sm">
                <table class="leaderboard">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Team</th>
                            <th v-for="criteria in criterias" :key="criteria.id">
                                {{ criteria.name }}
                            </th>
                            <th>Final Score (raw)</th>
                            <th>Final Score (standardized)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(score, i) in scores"
                            :key="i"
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
                            <td v-for="criteria in criterias" :key="criteria.id">
                                {{ getCriteriaScore(score, criteria.id) }}
                            </td>

                            <td>{{ score.rawFinalScore }}</td>
                            <td>{{ score.standardizedFinalScore }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import PageHeader from '../components/PageHeader.vue';
import Axios from 'axios';
import { Round, Country } from '../interfaces';

interface TeamScore {
    country: Country;
    criteriaSum: {
        criteriaId: number;
        sum: number;
    }[];
    judgingSum: {
        judgeId: number;
        sum: number;
    }[];
    rawFinalScore: number;
    standardizedFinalScore: number;
}

@Component({
    components: {
        PageHeader,
    },
})
export default class QualifierResult extends Vue {

    criterias = [];
    round: Round | null = null;

    async created (): Promise<void> {
        await this.getData();
    }

    async getData (): Promise<void> {
        const res = await Axios.get('/api/results/qualifiers');
        this.criterias = res.data.criterias;
        this.round = res.data.round;
    }

    get scores (): TeamScore[] {
        const teamsScores: TeamScore[] = [];

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

                            if (i !== i) {
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
                        });
                    }

                    teamScore.rawFinalScore = teamScore.criteriaSum.reduce((acc, c) => acc + c.sum, 0);
                    teamsScores.push(teamScore);
                }

            }
        }

        if (teamsScores.length) {
            const judgesIds = teamsScores[0].judgingSum.map(j => j.judgeId);

            for (const judgeId of judgesIds) {
                let judgeSum = 0;
                let judgeAvg = 0;
                let judgeSd = 0;

                for (const teamScore of teamsScores) {
                    const judgingSum = teamScore.judgingSum.find(j => j.judgeId === judgeId);

                    if (judgingSum) {
                        judgeSum += judgingSum.sum;
                    }
                }

                judgeAvg = judgeSum / teamsScores.length;

                for (const teamScore of teamsScores) {
                    const judgingSum = teamScore.judgingSum.find(j => j.judgeId === judgeId);

                    if (judgingSum) {
                        judgeSd += Math.pow(judgingSum.sum - judgeAvg, 2);
                    }
                }

                judgeSd = Math.sqrt(judgeSd / teamsScores.length);

                for (let i = 0; i < teamsScores.length; i++) {
                    const judgingSum = teamsScores[i].judgingSum.find(j => j.judgeId === judgeId);

                    if (judgingSum) {
                        // S* = S - S(avg) / SD
                        teamsScores[i].standardizedFinalScore = (judgingSum.sum - judgeAvg) / judgeSd;
                    }
                }
            }
        }

        teamsScores.sort((a, b) => b.standardizedFinalScore - a.standardizedFinalScore);

        return teamsScores;
    }

    getCriteriaScore (score: TeamScore, criteriaId: number): number {
        return score.criteriaSum.find(c => c.criteriaId === criteriaId)?.sum || 0;
    }

}
</script>
