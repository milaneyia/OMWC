<template>
    <div class="container text-center">
        <page-header
            title="Judging List"
            subtitle="This shows a listing of all the judging (scores/comments) done by entries"
        />

        <div
            v-for="round in rounds"
            :key="round.id"
            class="row text-left mt-3"
        >
            <div class="col-sm">
                <h5>{{ round.title }}</h5>

                <div
                    v-for="(match, i) in round.matches"
                    :key="match.id"
                >
                    <a
                        class="mb-2"
                        data-toggle="collapse"
                        :href="`#match-${match.id}`"
                    >
                        Match {{ i + 1 }}
                    </a>

                    <div
                        :id="`match-${match.id}`"
                        class="collapse"
                    >
                        <div class="card mb-2">
                            <div class="card-header">
                                {{ match.information }}
                            </div>

                            <div class="card-body p-0">
                                <data-table
                                    :headers="['Country', 'Judges']"
                                >
                                    <tr
                                        v-for="submission in match.submissions"
                                        :key="submission.id"
                                        data-toggle="modal"
                                        data-target="#detailModal"
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
                            </div>
                        </div>

                        <hr>
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
import { Route } from 'vue-router';
import Axios from 'axios';
import { Submission, Round, Match } from '../../interfaces';
import PageHeader from '../../components/PageHeader.vue';
import DataTable from '../../components/DataTable.vue';
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

    async beforeRouteEnter (to: Route, from: Route, next: Function): Promise<void> {
        const res = await Axios.get(`/api/admin/judging/`);
        next((vm: JudgingListing) => {
            vm.rounds = res.data.rounds;
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
