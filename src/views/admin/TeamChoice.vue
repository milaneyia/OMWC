<template>
    <div class="container text-center">
        <page-header
            title="Confirm Teams"
            subtitle="When you set a captain, their team/country will appear here + the members he's or not chosen"
        />

        <div class="row">
            <div class="col-sm">
                <div class="card">
                    <data-table
                        v-if="countries"
                        :headers="['Country', 'Captain', 'Chosen', 'Not chosen', '']"
                    >
                        <tr
                            v-for="country in countries"
                            :key="country.id"
                        >
                            <template v-if="country.users">
                                <td>{{ country.name }}</td>
                                <td>
                                    <a :href="`https://osu.ppy.sh/users/${getCaptain(country).osuId}`" target="__blank">
                                        {{ getCaptain(country).username }}
                                    </a>
                                </td>
                                <td>
                                    <span
                                        v-for="contestant in country.users.filter(u => u.isContestant)"
                                        :key="contestant.id"
                                    >
                                        <a :href="`https://osu.ppy.sh/users/${contestant.osuId}`" target="__blank">
                                            {{ contestant.username }}
                                        </a>
                                    </span>
                                </td>
                                <td>
                                    <span
                                        v-for="user in country.users.filter(u => !u.isContestant && !u.isCaptain)"
                                        :key="user.id"
                                    >
                                        <a :href="`https://osu.ppy.sh/users/${user.osuId}`" target="__blank">
                                            {{ user.username }}
                                        </a>
                                    </span>
                                </td>
                                <td>
                                    <button
                                        v-if="country.wasConfirmed"
                                        class="btn btn-sm btn-danger"
                                        @click="remove(country.id)"
                                    >
                                        Deny
                                    </button>
                                    <button
                                        v-else
                                        class="btn btn-sm btn-primary"
                                        @click="confirm(country.id)"
                                    >
                                        Confirm
                                    </button>
                                </td>
                            </template>
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
import { Country } from '../../interfaces';

@Component({
    components: {
        PageHeader,
        DataTable,
    },
})
export default class TeamChoice extends Vue {

    countries = [];

    async created (): Promise<void> {
        this.$store.commit('updateLoadingState');
        await this.getData();
        this.$store.commit('updateLoadingState');
    }

    async getData (): Promise<void> {
        const res = await Axios.get('/api/admin/teamsChoice');
        this.countries = res.data.countries;
    }

    async confirm (countryId: number): Promise<void> {
        const res = await Axios.post('/api/admin/teamsChoice/confirm', {
            countryId,
        });

        if (res.data.error) {
            alert(res.data.error);
        } else {
            await this.getData();
            alert('ok');
        }
    }

    async remove (countryId: number): Promise<void> {
        const res = await Axios.post('/api/admin/teamsChoice/remove', {
            countryId,
        });

        if (res.data.error) {
            alert(res.data.error);
        } else {
            await this.getData();
            alert('ok');
        }
    }

    getCaptain (country: Country): object {
        return country.users.find(u => u.isCaptain) || {};
    }

}
</script>
