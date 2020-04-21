<template>
    <div class="container text-center">
        <page-header>
            Captain Choice
        </page-header>

        <div class="row">
            <div class="col-sm">
                <div class="card">
                    <div class="card-header">
                        People who has opt-in to become captain will appear here + the votes they have recieved from people that applied to become mapper (and actually voted)
                    </div>
                </div>
            </div>
        </div>

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

                    <div class="card-body p-0">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Applicant</th>
                                    <th>Total Votes</th>
                                    <th>Voted by</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
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
                            </tbody>
                        </table>
                    </div>
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
import PageHeader from '../../components/PageHeader.vue';

@Component({
    components: {
        PageHeader,
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
