<template>
    <div class="container text-center">
        <page-header
            title="Judging List"
            subtitle="This shows a listing of all the judging (scores/comments) done by entries"
        >
            <select v-model="selectedRoundId" class="form-control mt-3">
                <option
                    v-for="round in rounds"
                    :key="round.id"
                    :value="round.id"
                >
                    {{ round.title }}
                </option>
            </select>
        </page-header>

        <template v-if="selectedRound">
            <qualifier-leaderboard v-if="selectedRound.isQualifier" />

            <div
                v-for="match in selectedRound.matches"
                :key="match.id"
                class="card my-2"
            >
                <div class="card-header">
                    {{ match.information }}
                </div>

                <data-table
                    v-if="match.submissions && match.submissions.length"
                    :headers="['Country', 'Count', 'Judges']"
                >
                    <tr
                        v-for="submission in match.submissions"
                        :key="submission.id"
                        data-toggle="modal"
                        data-target="#detailModalAdmin"
                        style="cursor: pointer"
                        @click="select(selectedRound.isQualifier, submission, match)"
                    >
                        <td>
                            <div class="align-items-center d-flex">
                                <div class="country-flag mr-2" :style="`background-image: url(https://osu.ppy.sh/images/flags/${submission.country.code}.png)`" />
                                {{ `${submission.country.name} (${submission.anonymisedAs || 'Not anonymized'})` }}
                            </div>
                        </td>
                        <td
                            :class="getJudgesInvolvedCount(submission, selectedRound.isQualifier) === judgeCount ? 'text-success' : 'text-danger'"
                        >
                            {{ getJudgesInvolvedCount(submission, selectedRound.isQualifier) }} done of {{ judgeCount }}
                        </td>
                        <td>{{ getJudgesInvolved(submission, selectedRound.isQualifier) }}</td>
                    </tr>
                </data-table>

                <div
                    v-else
                    class="card-body"
                >
                    No submissions
                </div>
            </div>
        </template>

        <elimination-judging-detail
            v-if="selectedType === 'elimination'"
            id="detailModalAdmin"
            :match="selected"
        />

        <qualifier-judging-detail
            v-if="selectedType === 'qualifier'"
            id="detailModalAdmin"
            :submission="selected"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Submission, Round, Match } from '../../interfaces';
import PageHeader from '../../components/PageHeader.vue';
import DataTable from '../../components/admin/DataTable.vue';
import EliminationJudgingDetail from '../../components/results/EliminationJudgingDetail.vue';
import QualifierJudgingDetail from '../../components/results/QualifierJudgingDetail.vue';
import QualifierLeaderboard from '../../components/results/QualifierLeaderboard.vue';

@Component({
    components: {
        PageHeader,
        DataTable,
        EliminationJudgingDetail,
        QualifierJudgingDetail,
        QualifierLeaderboard,
    },
})
export default class JudgingListing extends Vue {

    rounds: Round[] = [];
    selected: Submission | Match | null = null;
    selectedType = '';
    selectedRoundId = 1;
    judgeCount = 0;

    async created (): Promise<void> {
        await Promise.all([
            this.initialRequest<{ rounds: []; judgeCount: number }>('/api/admin/judging', (data) => {
                this.rounds = data.rounds;
                this.judgeCount = data.judgeCount;
            }),

            this.getRequest('/api/results/qualifiers', null, (data) => {
                this.$store.commit('updateQualifier', data);
            }),
        ]);
    }

    get selectedRound (): Round | undefined {
        return this.rounds.find(r => r.id === this.selectedRoundId);
    }

    getJudgesInvolvedCount (submission: Submission, isQualifier: boolean): number {
        let judges = [];

        if (isQualifier) {
            judges = submission.qualifierJudging.map(j => j.judge);
        } else {
            judges = submission.eliminationJudging.map(j => j.judge);
        }

        return judges.length;
    }

    getJudgesInvolved (submission: Submission, isQualifier: boolean): string {
        let judges = [];

        if (isQualifier) {
            judges = submission.qualifierJudging.map(j => j.judge.username);
        } else {
            judges = submission.eliminationJudging.map(j => j.judge.username);
        }

        return judges.join(', ');
    }

    select (isQualifier: boolean, submission: Submission, match: Match): void {
        if (isQualifier) {
            this.selected = submission;
            this.selectedType = 'qualifier';
        } else {
            this.selected = match;
            this.selectedType = 'elimination';
        }
    }

}

</script>
