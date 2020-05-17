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
                            <td>
                                <a :href="`https://osu.ppy.sh/users/${request.user.osuId}`" target="__blank">
                                    {{ request.user.username }}
                                </a>
                            </td>
                            <td>
                                <a :href="request.mapLink">
                                    {{ shortenLink(request.mapLink) }}
                                </a>
                            </td>
                            <td>{{ request.status }}</td>
                            <td>{{ new Date(request.createdAt).toLocaleString() }}</td>
                            <td>
                                <template v-if="request.status == 'Pending'">
                                    <button
                                        class="btn btn-sm btn-success mb-2"
                                        @click="setStatus(request.id, 'Accepted')"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        class="btn btn-sm btn-danger mb-2"
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

    async created (): Promise<void> {
        this.$store.commit('updateLoadingState');
        const res = await Axios.get(`/api/admin/users/access`);
        this.requests = res.data.requests;
        this.$store.commit('updateLoadingState');
    }

    shortenLink(link: string): string {
        if (link?.length > 60) {
            return link.slice(0, 60) + '...';
        }

        return link || '';
    }

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

}
</script>
