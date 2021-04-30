<template>
    <div class="container-lg py-2 text-center">
        <page-header
            title="Leaderboard"
        />

        <div v-if="qualifier" class="row my-3">
            <div class="col-sm">
                <div class="round__details">
                    Submissions
                    <div class="round__date">
                        <time-string :timestamp="qualifier.submissionsStartedAt" /> -
                        <time-string :timestamp="qualifier.submissionsEndedAt" />
                    </div>
                </div>
            </div>
            <div class="col-sm">
                <div class="round__details">
                    Judging
                    <div class="round__date">
                        <time-string :timestamp="qualifier.judgingStartedAt" /> -
                        <time-string :timestamp="qualifier.judgingEndedAt" />
                    </div>
                </div>
            </div>
            <div class="col-sm">
                <div class="round__details">
                    Results
                    <div class="round__date">
                        <time-string :timestamp="qualifier.resultsAt" />
                    </div>
                </div>
            </div>
        </div>

        <qualifier-leaderboard />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import PageHeader from '../../components/PageHeader.vue';
import CountryFlagCell from '../../components/CountryFlagCell.vue';
import QualifierLeaderboard from '../../components/results/QualifierLeaderboard.vue';
import TimeString from '../../components/TimeString.vue';
import { Round } from '../../interfaces';
import { State } from 'vuex-class';
import criterias from '../../data/criterias';
import judges from '../../data/judges';
import qualifier from '../../data/qualifier';
import teamsScores from '../../data/teamsScores';
import judgesCorrel from '../../data/judgesCorrel';

@Component({
    components: {
        PageHeader,
        QualifierLeaderboard,
        CountryFlagCell,
        TimeString,
    },
})
export default class QualifierResult extends Vue {

    @State qualifier!: Round | null;

    created (): void {
        if (!this.qualifier) {
            this.$store.commit('updateQualifier', {
                criterias,
                judges,
                qualifier,
                teamsScores,
                judgesCorrel,
            });
        }
    }
}
</script>
