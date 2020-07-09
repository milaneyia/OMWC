<template>
    <div class="container text-center">
        <template v-if="currentRound">
            <qualifier
                v-if="currentRound.isQualifier"
                :round="currentRound"
                :criterias="criterias"
                :judging-done.sync="judgingDone"
            />
            <elimination
                v-else
                :round="currentRound"
                :judging-done.sync="judgingDone"
            />
        </template>

        <img
            v-else
            src="https://media1.tenor.com/images/46d73c3cc50fa32e0e1d8c2a38007477/tenor.gif?itemid=7513882"
            width="600"
            height="600"
            alt=""
        >
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';
import { Criteria, Round } from '../interfaces';
import Qualifier from '../components/judging/QualifierJudging.vue';
import Elimination from '../components/judging/EliminationJudging.vue';

interface ApiResponse {
    currentRound: Round | null;
    criterias: Criteria[];
    judgingDone: [];
}

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
        await this.initialRequest<ApiResponse>('/api/judging', (data) => {
            this.currentRound = data.currentRound;
            this.criterias = data.criterias;
            this.judgingDone = data.judgingDone;
        });
    }
}
</script>
