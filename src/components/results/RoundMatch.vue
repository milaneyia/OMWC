<template>
    <ul class="match">
        <li
            v-for="(team, i) in [match.teamA, match.teamB]"
            :key="team && team.id || i"
            class="match__team"
            :class="[
                i % 2 ? 'match__team--right' : 'match__team--left',
                hasJudgingDone ? 'match__team--clickable' : '',
            ]"
            :data-toggle="hasJudgingDone ? 'modal' : ''"
            :data-target="hasJudgingDone ? '#detailModal' : ''"
            @click="hasJudgingDone ? $emit('update:select-match') : ''"
        >
            <div class="match__team-flag country-flag" :style="`background-image: url(https://osu.ppy.sh/images/flags/${team && team.code || 'A1'}.png)`" />
            <div class="match__team-info">
                <template v-if="team">
                    <div class="match__team-name">
                        {{ team.name }}
                    </div>

                    <div
                        v-if="hasJudgingDone"
                        class="match__team-score"
                    >
                        {{ getScore(team.id) }}
                    </div>
                </template>
            </div>
        </li>
    </ul>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Match } from '../../interfaces';

@Component({
    props: {
        match: {
            type: Object,
            required: true,
        },
    },
})
export default class RoundMatch extends Vue {

    match!: Match;

    get hasJudgingDone (): undefined | number {
        return this.match?.eliminationJudging?.length;
    }

    getScore (id: number): number {
        let score = 0;

        if (this.match.eliminationJudging?.length) {
            for (const judging of this.match.eliminationJudging) {
                if (judging.submissionChosen?.country?.id === id) {
                    score++;
                }
            }
        }

        return score;
    }

}
</script>
