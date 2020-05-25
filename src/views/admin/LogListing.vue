<template>
    <div class="container text-center">
        <page-header
            title="Logs"
        />

        <div class="row">
            <div class="col-sm">
                <div class="card card-body text-left">
                    <data-table
                        :headers="['Date', 'Action', 'Detail']"
                    >
                        <tr
                            v-for="log in logs"
                            :key="log.id"
                        >
                            <td>{{ log.createdAt | shortDateTimeString }}</td>
                            <td>{{ log.type }}</td>
                            <td>{{ log.text }}</td>
                        </tr>
                    </data-table>

                    <button
                        v-if="logs.length % 50 == 0"
                        class="btn btn-block btn-primary"
                        @click="showMore($event)"
                    >
                        show more
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import PageHeader from '../../components/PageHeader.vue';
import DataTable from '../../components/DataTable.vue';

@Component({
    components: {
        PageHeader,
        DataTable,
    },
})
export default class LogListing extends Vue {

    logs = [];
    skip = 50;

    async created (): Promise<void> {
        await this.initialRequest<{ logs: [] }>('/api/admin/logs', (data) => {
            this.logs = data.logs;
        });
    }

    async showMore (e: Event): Promise<void> {
        await this.getRequest<{ logs: [] }>(`/api/admin/logs?s=${this.skip}`, e, (data) => {
            this.logs = this.logs.concat(data.logs);
            this.skip += 50;
        });
    }

}
</script>
