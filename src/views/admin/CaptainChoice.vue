<template>
    <div class="container text-center">
        <page-header
            title="Captain Choice"
            subtitle="People who has opt-in to become captain will appear here + the votes they have recieved"
        />

        <div class="row">
            <div class="col-sm">
                <div
                    v-for="country in applicationsByCountry"
                    :key="country.id"
                    class="card my-3"
                >
                    <div class="card-header">
                        <h5 class="mb-0 align-items-center d-flex justify-content-center">
                            <div class="country-flag mr-2" :style="`background-image: url(https://osu.ppy.sh/images/flags/${country.code}.png)`" />
                            {{ country.name }}
                        </h5>
                    </div>

                    <data-table
                        :headers="['Applicant', 'Total Votes', 'Voted by', '']"
                        custom-class="table-responsive-md"
                    >
                        <tr
                            v-for="applicant in country.users"
                            :key="applicant.id"
                        >
                            <td>
                                <a :href="`https://osu.ppy.sh/users/${applicant.osuId}`" target="__blank">
                                    {{ applicant.username }}
                                </a>
                            </td>
                            <td>{{ applicant.captainApplication.userVotes.length }}</td>
                            <td>
                                <span
                                    v-for="voter in applicant.captainApplication.userVotes"
                                    :key="voter.id"
                                >
                                    <a :href="`https://osu.ppy.sh/users/${voter.osuId}`" target="__blank">
                                        {{ voter.username }}
                                    </a>
                                </span>
                            </td>
                            <td>
                                <button
                                    class="btn btn-sm btn-primary mb-2"
                                    data-toggle="modal"
                                    data-target="#reasonModal"
                                    @click="selectedReason = applicant.captainApplication.reason"
                                >
                                    View reason
                                </button>
                                <button
                                    v-if="applicant.isCaptain"
                                    class="btn btn-sm btn-danger mb-2"
                                    @click="remove(applicant.captainApplication.id, $event)"
                                >
                                    Remove
                                </button>
                                <button
                                    v-else-if="!(country.users.find(u => u.isCaptain))"
                                    class="btn btn-sm btn-success mb-2"
                                    @click="choose(applicant.captainApplication.id, $event)"
                                >
                                    Choose
                                </button>
                            </td>
                        </tr>
                    </data-table>
                </div>
            </div>
        </div>

        <div
            id="reasonModal"
            class="modal fade"
            tabindex="-1"
        >
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Reason
                        </h5>
                        <button
                            type="button"
                            class="close"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p class="text-left">
                            <span style="white-space: pre-line;">{{ selectedReason }}</span>
                        </p>
                    </div>
                </div>
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
import DataTable from '../../components/admin/DataTable.vue';

@Component({
    components: {
        PageHeader,
        DataTable,
    },
})
export default class CaptainChoice extends Vue {

    @State schedule!: Schedule;
    applicationsByCountry = [];
    selectedReason = '';

    async created (): Promise<void> {
        await this.getData();
    }

    async getData (): Promise<void> {
        await this.initialRequest<{ applicationsByCountry: [] }>('/api/admin/captainChoice', (data) => {
            this.applicationsByCountry = data.applicationsByCountry;
        });
    }

    async choose (applicationId: number, e: Event): Promise<void> {
        await this.postRequest('/api/admin/captainChoice/choose', {
            applicationId,
        }, e, this.getData);
    }

    async remove (applicationId: number, e: Event): Promise<void> {
        await this.postRequest('/api/admin/captainChoice/remove', {
            applicationId,
        }, e, this.getData);
    }

}
</script>
