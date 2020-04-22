<template>
    <div class="container text-center">
        <page-header-extended>
            <template #title>
                Captain Choice
            </template>

            <template #subtitle>
                People who has opt-in to become captain will appear here + the votes they have recieved from people that applied to become mapper (and actually voted)
            </template>
        </page-header-extended>

        <div class="row">
            <div v-if="applicationsByCountry && applicationsByCountry.length" class="col-sm">
                <div
                    v-for="country in applicationsByCountry"
                    :key="country.id"
                    class="card"
                >
                    <div class="card-header">
                        <h4>{{ country.name }}</h4>
                    </div>

                    <data-table
                        :headers="['Applicant', 'Total Votes', 'Voted by', '']"
                    >
                        <tr
                            v-for="applicant in country.users"
                            :key="applicant.id"
                        >
                            <td>{{ applicant.username }}</td>
                            <td>{{ applicant.captainApplication.userVotes.length }}</td>
                            <td>
                                <span
                                    v-for="voter in applicant.captainApplication.userVotes"
                                    :key="voter.id"
                                >
                                    {{ voter.username + ' ' }}
                                </span>
                            </td>
                            <td>
                                <button
                                    v-if="applicant.isCaptain"
                                    class="btn btn-sm btn-danger"
                                    @click="remove(applicant.captainApplication.id)"
                                >
                                    Remove
                                </button>
                                <button
                                    v-else-if="!(country.users.find(u => u.isCaptain))"
                                    class="btn btn-sm btn-primary"
                                    @click="choose(applicant.captainApplication.id)"
                                >
                                    Choose
                                </button>
                            </td>
                        </tr>
                    </data-table>
                </div>
            </div>

            <p v-else class="card-body">
                No applications yet
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { State } from 'vuex-class';
import { Schedule } from '../../interfaces';
import Axios from 'axios';
import PageHeaderExtended from '../../components/PageHeaderExtended.vue';
import DataTable from '../../components/DataTable.vue';

@Component({
    components: {
        PageHeaderExtended,
        DataTable,
    },
})
export default class CaptainChoice extends Vue {

    @State schedule!: Schedule;
    applicationsByCountry = [];

    async created (): Promise<void> {
        await this.getData();
    }

    async getData (): Promise<void> {
        const res = await Axios.get('/api/admin/captainChoice');
        this.applicationsByCountry = res.data.applicationsByCountry;
    }

    async choose (applicationId: number): Promise<void> {
        const res = await Axios.post('/api/admin/captainChoice/choose', {
            applicationId,
        });

        if (res.data.error) {
            alert(res.data.error);
        } else {
            await this.getData();
            alert('ok');
        }
    }

    async remove (applicationId: number): Promise<void> {
        const res = await Axios.post('/api/admin/captainChoice/remove', {
            applicationId,
        });

        if (res.data.error) {
            alert(res.data.error);
        } else {
            await this.getData();
            alert('ok');
        }
    }

}
</script>
