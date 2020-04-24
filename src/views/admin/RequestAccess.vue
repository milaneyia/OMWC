<template>
    <div class="container text-center">
        <page-header
            title="Access Requests"
            subtitle="People who doesn't have ranked maps but GDs can request access for captain apps/voting"
        />

        <div class="row">
            <div class="col-sm">
                <div class="card">
                    <data-table
                        v-if="requests"
                        :headers="['User', 'Link', 'Status', 'Date Submission', '']"
                    >
                        <tr
                            v-for="request in requests"
                            :key="request.id"
                        >
                            <td>{{ request.user.username }}</td>
                            <td>
                                <a :href="request.mapLink">
                                    {{ request.mapLink }}
                                </a>
                            </td>
                            <td>{{ request.status }}</td>
                            <td>{{ request.createdAt }}</td>
                            <td>
                                <template v-if="request.status == 'Pending'">
                                    <button
                                        class="btn btn-sm btn-primary"
                                        @click="setStatus(request.id, 'Accepted')"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        class="btn btn-sm btn-danger"
                                        @click="setStatus(request.id, 'Rejected')"
                                    >
                                        Reject
                                    </button>
                                </template>
                            </td>
                        </tr>
                    </data-table>

                    <p v-else>
                        None
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Route } from 'vue-router';
import Axios from 'axios';
import PageHeader from '../../components/PageHeader.vue';
import DataTable from '../../components/DataTable.vue';

@Component({
    components: {
        PageHeader,
        DataTable,
    },
})
export default class RequestAccess extends Vue {

    requests = [];

    async setStatus(requestId: number, status: string): Promise<void> {
        const res = await Axios.post(`/api/admin/users/access/${requestId}/save`, {
            status,
        });

        if (res.data.error) {
            alert(res.data.error);
        } else {
            this.requests = res.data.requests;
            alert('Done');
        }
    }

    async beforeRouteEnter (to: Route, from: Route, next: Function): Promise<void> {
        const res = await Axios.get(`/api/admin/users/access`);
        next((vm: RequestAccess) => {
            vm.requests = res.data.requests;
        });
    }

    async beforeRouteUpdate (to: Route, from: Route, next: Function): Promise<void> {
        this.requests = [];
        const res = await Axios.get(`/api/admin/users/access`);
        this.requests = res.data.requests;

        next();
    }

}
</script>
