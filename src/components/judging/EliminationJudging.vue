<template>
    <div>
        <page-header
            title="Judging List"
            subtitle=" "
        >
            You have till <b><time-string :timestamp="round.judgingEndedAt" /></b> to finish
        </page-header>

        <div class="row mb-2">
            <div class="col-sm">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">
                            {{ round.title }}
                        </h4>
                        <a
                            :href="`/api/judging/round/${round.id}/downloadZip`"
                            target="_blank"
                        >
                            Download all entries
                        </a>
                    </div>
                    <div class="card-body">
                        <match-judging
                            v-for="match in round.matches"
                            :key="match.id"
                            :match="match"
                            :related-judging="findRelatedJudging(match.id) || null"
                            :editing-match.sync="editingMatch"
                            @update:judging-done="$emit('update:judging-done', $event)"
                        />
                    </div>
                </div>
            </div>
        </div>
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
