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

                    <button class="btn btn-block btn-primary" @click="showMore">
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
import Axios from 'axios';
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
        this.$store.commit('updateLoadingState');
        const res = await Axios.get(`/api/admin/logs`);
        this.logs = res.data.logs;
        this.$store.commit('updateLoadingState');
    }

    async showMore (): Promise<void> {
        const res = await Axios.get(`/api/admin/logs?s=${this.skip}`);

        if (res.data.logs) {
            this.logs = this.logs.concat(res.data.logs);
            this.skip += 50;
        } else {
            alert(res.data.error || 'Something went wrong');
        }
    }

}
</script>
