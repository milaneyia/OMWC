<template>
    <div class="container text-center">
        <template v-if="currentRound">
            <qualifier
                v-if="currentRound.isQualifier"
                :round="currentRound"
                :criterias="criterias"
                :judging-done="judgingDone"
            />
            <elimination
                v-else-if="currentRound.isQualifier === false"
                :round="currentRound"
            />
        </template>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Axios from 'axios';

import { State } from 'vuex-class';
import Component from 'vue-class-component';
import { Criteria, Round } from '../interfaces';
import Qualifier from '../components/judging/QualifierJudging.vue';
import Elimination from '../components/judging/EliminationJudging.vue';

@Component({
    components: {
        Qualifier,
        Elimination,
    },
})
export default class Judging extends Vue {

    @State user!: object;
    currentRound: Round | null = null;
    criterias: Criteria[] = [];
    judgingDone = [];

    async created (): Promise<void> {
        const { data } = await Axios.get('/api/judging');
        this.currentRound = data.currentRound;
        this.criterias = data.criterias;
        this.judgingDone = data.judgingDone;
    }
}
</script>