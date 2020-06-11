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
            />
        </template>
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
