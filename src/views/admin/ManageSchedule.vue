<template>
    <div class="container text-center">
        <page-header
            title="Schedule to follow"
        />

        <div class="row mb-2 box py-2">
            <div class="col-sm-12">
                <p>All dates should be set at once, but you can edit later in case of changes</p>
            </div>

            <hr>

            <div
                v-for="[key, value] in Object.entries(editSchedule)"
                :key="key"
                class="col-sm-6"
            >
                <div class="form-group">
                    <label
                        :for="key"
                    >
                        {{ value.title }}
                    </label>

                    <input
                        v-model="editSchedule[key].date"
                        type="date"
                        class="form-control"
                        :name="key"
                    >
                </div>
            </div>

            <div class="col-sm-12">
                <button class="btn btn-primary btn-block" @click="save">
                    Update
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { State } from 'vuex-class';
import { Schedule } from '../../interfaces';
import Axios from 'axios';
import PageHeader from '../../components/PageHeader.vue';

@Component({
    components: {
        PageHeader,
    },
})
export default class ManageSchedule extends Vue {

    @State schedule!: Schedule;
    editSchedule = {};

    created (): void {
        this.editSchedule = {
            applicationsStartedAt: {
                title: 'Applications Start Date',
                date: this.schedule.applicationsStartedAt,
            },
            applicationsEndedAt: {
                title: 'Applications End Date',
                date: this.schedule.applicationsEndedAt,
            },
            captainVotingStartedAt: {
                title: 'Captain Voting Start Date',
                date: this.schedule.captainVotingStartedAt,
            },
            captainVotingEndedAt: {
                title: 'Captain Voting End Date',
                date: this.schedule.captainVotingEndedAt,
            },
            mappersChoiceStartedAt: {
                title: 'Mappers Choice Start Date',
                date: this.schedule.mappersChoiceStartedAt,
            },
            mappersChoiceEndedAt: {
                title: 'Mappers Choice End Date',
                date: this.schedule.mappersChoiceEndedAt,
            },
            contestStartedAt: {
                title: 'Contest Start Date',
                date: this.schedule.contestStartedAt,
            },
            contestEndedAt: {
                title: 'Contest End Date',
                date: this.schedule.contestEndedAt,
            },
        };
    }

    async save (): Promise<void> {
        const res = await Axios.post('/api/admin/schedule/save', this.editSchedule);

        if (res.data.error) {
            alert(res.data.error);
        } else {
            this.$store.commit('updateSchedule', res.data);
            this.$router.push('/');
        }
    }

}
</script>
