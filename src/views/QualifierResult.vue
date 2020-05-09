<template>
    <div class="container-lg py-2 text-center">
        <page-header
            title="Leaderboard"
        />

        <div class="row">
            <div class="col-sm">
                <div class="my-1">
                    <a
                        href="#"
                        @click="showCriteriasScores = !showCriteriasScores"
                    >
                        Change display mode
                    </a>
                </div>

                <table class="leaderboard">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Team</th>
                            <template v-if="showCriteriasScores">
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
                            <template v-if="showCriteriasScores">
                                <td v-for="criteria in criterias" :key="criteria.id">
                                    {{ getCriteriaScore(score, criteria.id) }}
                                </td>
                            </template>
                            <template v-else>
                                <td v-for="judge in judges" :key="judge.id">
                                    {{ getJudgeScore(score, judge.id) }}
                                </td>
                            </template>

                            <td>{{ score.rawFinalScore }}</td>
                            <td>{{ score.standardizedFinalScore }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div
            v-if="selectedScore"
            id="detailModal"
            class="modal fade"
            tabindex="-1"
        >
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{ selectedScore.country.name }}
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
                            v-for="(qualifierJudging, i) in scoreDetail.qualifierJudging"
                            :key="qualifierJudging.id"
                        >
                            <b>{{ qualifierJudging.judge.username }}</b>

                            <div
                                v-for="judgingToCriterias in qualifierJudging.qualifierJudgingToCriterias"
                                :key="judgingToCriterias.id"
                                class="my-1"
                            >
                                <a
                                    data-toggle="collapse"
                                    :href="`#judgingToCriteria${judgingToCriterias.id}`"
                                    @click="showComment(judgingToCriterias.id)"
                                >
                                    <small>
                                        <i
                                            class="fas mr-2"
                                            :class="getCollapseClass(judgingToCriterias.id)"
                                        />
                                    </small>
                                    {{ judgingToCriterias.criteria.name }}
                                    <b>({{ judgingToCriterias.score }})</b>:
                                </a>


                                <p
                                    :id="`judgingToCriteria${judgingToCriterias.id}`"
                                    class="text-light ml-3 collapse"
                                >
                                    <span style="white-space: pre-line;">{{ judgingToCriterias.comment }}</span>
                                </p>
                            </div>

                            <hr v-if="i < scoreDetail.qualifierJudging.length - 1">
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
import PageHeader from '../components/PageHeader.vue';
import Axios from 'axios';
import { Round, Country, User, Submission } from '../interfaces';

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

@Component({
    components: {
        PageHeader,
    },
})
export default class QualifierResult extends Vue {

    criterias = [];
    judges: User[] = [];
    round: Round | null = null;
    selectedScore: TeamScore | null = null;
    commentsExpanded: number[] = [];
    showCriteriasScores = true;

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

                for (const teamScore of teamsScores) {
                    judgeSum += teamScore.judgingSum.find(j => j.judgeId === judgeId)?.sum || 0;
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
                    const j = teamsScores[i].judgingSum.findIndex(j => j.judgeId === judgeId);

                    if (j !== -1) {
                        // S* = S - S(avg) / SD
                        const stdScore = (teamsScores[i].judgingSum[j].sum - judgeAvg) / judgeSd;
                        teamsScores[i].standardizedFinalScore += stdScore;
                        teamsScores[i].judgingSum[j].standardized = stdScore;
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

    getJudgeScore (score: TeamScore, judgeId: number): string {
        const judgeScore = score.judgingSum.find(j => j.judgeId === judgeId);

        return `${judgeScore?.sum || 0} (${judgeScore?.standardized.toFixed(3) || 0})`;
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
