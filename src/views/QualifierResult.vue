<template>
    <div class="container text-center">
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
                            <th>Final Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(team, i) in teams"
                            :key="i"
                            :class="[
                                team.eliminationRound ? 'team-eliminated' : '',
                                i == 0 ? 'first-place': '',
                                i == 1 ? 'second-place' : '',
                                i == 2 ? 'third-place' : '',
                            ]"
                        >
                            <td>{{ i + 1 }}</td>
                            <td class="d-flex justify-content-center align-items-center">
                                <div class="country-flag" :style="`background-image: url(https://osu.ppy.sh/images/flags/${team.code}.png)`">
                                    <div class="ml-2">
                                        {{ team.name }}
                                    </div>
                                </div>
                            </td>
                            <td v-for="criteria in criterias" :key="criteria.id">
                                {{ (team.criteriaScores && team.criteriaScores.find(s => s.criteriaId === criteria.Id).score) || 0 }}
                            </td>

                            <td>{{ team.finalScore }}</td>
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
import { Round } from '../interfaces';

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

    get teams (): [] {
        if (this.round?.matches.length) {
            const submissions = this.round.matches[0].submissions;

            if (submissions) {
                for (const submission of submissions) {
                    let sumScore = 0;

                    for (const qualifierJudging of submission.qualifierJudging) {
                        sumScore += qualifierJudging.qualifierJudgingToCriterias.score;
                    }
                }
            }

        }

        return [];
    }

}
</script>
