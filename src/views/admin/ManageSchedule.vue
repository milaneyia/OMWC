<template>
    <div class="container text-center">
        <page-header
            title="Schedule to follow"
            subtitle="All dates should be set at once, but you can edit later in case of changes"
        />

        <div class="row mb-2 box py-2">
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
                <button class="btn btn-primary btn-block" @click="save($event)">
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
                date: this.schedule?.applicationsStartedAt || new Date(),
            },
            applicationsEndedAt: {
                title: 'Applications End Date',
                date: this.schedule?.applicationsEndedAt || new Date(),
            },
            captainVotingStartedAt: {
                title: 'Captain Voting Start Date',
                date: this.schedule?.captainVotingStartedAt || new Date(),
            },
            captainVotingEndedAt: {
                title: 'Captain Voting End Date',
                date: this.schedule?.captainVotingEndedAt || new Date(),
            },
            mappersChoiceStartedAt: {
                title: 'Mappers Choice Start Date',
                date: this.schedule?.mappersChoiceStartedAt || new Date(),
            },
            mappersChoiceEndedAt: {
                title: 'Mappers Choice End Date',
                date: this.schedule?.mappersChoiceEndedAt || new Date(),
            },
        };
    }

    async save (e: Event): Promise<void> {
        await this.postRequest<{ schedule: Schedule }>('/api/admin/schedule/save', this.editSchedule, e, (data) => {
            this.$store.commit('updateSchedule', data.schedule);
            alert('Saved');
        });
    }

}
</script>
