<template>
    <div class="container text-center">
        <page-header
            title="Judging List"
            subtitle="This shows a listing of all the judging (scores/comments) done by entries"
        />

        <div
            v-for="(round, i) in rounds"
            :key="round.id"
            class="row mt-3"
        >
            <div class="col-sm">
                <h5 class="box py-2">
                    <a
                        :href="`#round-${i}`"
                        data-toggle="collapse"
                    >
                        {{ round.title }}
                    </a>
                </h5>

                <div
                    v-for="match in round.matches"
                    :id="`round-${i}`"
                    :key="match.id"
                    class="collapse card mb-2"
                >
                    <div class="card-header">
                        {{ match.information }}
                    </div>

                    <data-table
                        v-if="match.submissions && match.submissions.length"
                        :headers="['Country', 'Judges']"
                    >
                        <tr
                            v-for="submission in match.submissions"
                            :key="submission.id"
                            data-toggle="modal"
                            data-target="#detailModal"
                            style="cursor: pointer"
                            @click="select(round.isQualifier, submission, match)"
                        >
                            <td>
                                <div class="align-items-center d-flex">
                                    <div class="country-flag mr-2" :style="`background-image: url(https://osu.ppy.sh/images/flags/${submission.country.code}.png)`" />
                                    {{ `${submission.country.name} (${submission.anonymisedAs || 'Not anonymized'})` }}
                                </div>
                            </td>
                            <td>{{ getJudgesInvolved(submission, round.isQualifier) }}</td>
                        </tr>
                    </data-table>

                    <div
                        v-else
                        class="card-body"
                    >
                        No submissions
                    </div>
                </div>
            </div>
        </div>

        <elimination-judging-detail
            v-if="selectedType === 'elimination'"
            :match="selected"
        />

        <qualifier-judging-detail
            v-if="selectedType === 'qualifier'"
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

@Component({
    components: {
        PageHeader,
        DataTable,
        EliminationJudgingDetail,
        QualifierJudgingDetail,
    },
})
export default class JudgingListing extends Vue {

    rounds: Round[] = [];
    selected: Submission | Match | null = null;
    selectedType = '';

    async created (): Promise<void> {
        await this.initialRequest<{ rounds: [] }>('/api/admin/judging', (data) => {
            this.rounds = data.rounds;
        });
    }

    getJudgesInvolved (submission: Submission, isQualifier: boolean): string {
        let judges = [];

        if (isQualifier) {
            judges = submission.qualifierJudging.map(j => j.judge.username);
        } else {
            judges = submission.eliminationJudging.map(j => j.judge.username);
        }

        return `(${judges.length}): ${judges.join(', ')}`;
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
