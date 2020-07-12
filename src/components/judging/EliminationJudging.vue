<template>
    <div>
        <page-header
            title="Judging List"
            subtitle=" "
        >
            <h4>{{ round.title }}</h4>
            <p>You have till <b><time-string :timestamp="round.judgingEndedAt" /></b> to finish</p>
            <a
                :href="`/api/judging/round/${round.id}/downloadZip`"
                target="_blank"
            >
                Download all entries
            </a>
        </page-header>

        <match-judging
            v-for="match in round.matches"
            :key="match.id"
            :match="match"
            :related-judging="findRelatedJudging(match.id) || null"
            :editing-match.sync="editingMatch"
            @update:judging-done="$emit('update:judging-done', $event)"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import PageHeader from '../PageHeader.vue';
import TimeString from '../TimeString.vue';
import MatchJudging from './MatchJudging.vue';
import { EliminationJudging } from '../../interfaces';

@Component({
    props: {
        round: {
            type: Object,
            required: true,
        },
        judgingDone: {
            type: Array,
            required: true,
        },
    },
    components: {
        PageHeader,
        TimeString,
        MatchJudging,
    },
})
export default class Elimination extends Vue {

    judgingDone!: EliminationJudging[];

    editingMatch = 0;

    findRelatedJudging (matchId: number): EliminationJudging | undefined {
        return this.judgingDone.find(j => j.matchId === matchId);
    }

}
</script>
