<template lang="pug">
    .container.text-center
        .row.mb-4
            .col-sm
                .card
                    .card-body
                        h4.card-title {{ currentRound.title }}
                        a.card-subtitle(:href="currentRound.anonymisedLink") Download .osz

                        hr

                        .form-group
                            select.form-control(v-model="selectedSubmissionId" @change="setRelatedJudging()")
                                option(value="0" disabled selected) Choose an entry
                                option(v-for="submission in currentRound.submissions" :key="submission.id" :value="submission.id")
                                    | {{ submission.anonymisedAs }}
        
        .row(v-if="selectedSubmissionId")
            .col-sm
                .card
                    .card-body
                        ul.nav.nav-tabs.mb-4
                            li.nav-item(v-for="criteria in criterias" :key="criteria.id")
                                a.nav-link(
                                    href="#"
                                    @click="selectCriteria(criteria.id)"
                                    :class="selectedCriteriaId === criteria.id ? 'active' : ''"
                                )
                                    | {{ criteria.name }}

                        div(v-if="selectedCriteriaId")
                            .form-group
                                label Score
                                input.form-control(type="number" step=".01" v-model="judging.score")

                            .form-group
                                label Comment
                                textarea.form-control(maxlength="3000" rows="3" v-model.trim="judging.comment")

                            button.btn.btn-primary.btn-block(type="button" @click="save()")
                                | Save

        .row
            .col-sm
                p {{ info }}

</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';

interface Submission {
    id: number;
    anonymisedAs: string;
}

interface Judging {
    id?: number;
    submissionId?: number;
    judgingCriteriaId?: number;
    score?: number;
    comment?: string;
}

export default Vue.extend({
    props: {
        currentRoundProp: Object,
        judgingDoneProp: Array as () => Judging[],
        criterias: Array,
    },
    data () {
        return {
            currentRound: this.currentRoundProp || {},
            judgingDone: this.judgingDoneProp || [],
            selectedSubmissionId: 0,
            selectedCriteriaId: 0,
            info: null,
            relatedJudging: [] as Judging[],
            judging: {} as Judging,
        }
    },
    methods: {
        setRelatedJudging () {
            this.relatedJudging = this.judgingDone.filter((j) => j.submissionId === this.selectedSubmissionId);
        },
        selectCriteria (id: number) {
            this.selectedCriteriaId = id;
            this.judging = this.relatedJudging.find((j) => j.judgingCriteriaId === id) || {};
        },
        async save () {
            const res = await axios.post('/judging/save', {
                submissionId: this.selectedSubmissionId,
                criteriaId: this.selectedCriteriaId,
                score: this.judging.score,
                comment: this.judging.comment,
            });

            if (res.data) {
                this.info = res.data.success || res.data.error;

                if (res.data.success) {
                    const savedJuging: Judging = res.data.judging;
                    const i = this.judgingDone.findIndex(j => j.id === savedJuging.id);
                    
                    if (i !== -1) {
                        this.judgingDone[i] = savedJuging;
                    } else {
                        this.judgingDone.push(savedJuging);
                    }

                    this.setRelatedJudging();
                }
            }
        }
    },
});
</script>