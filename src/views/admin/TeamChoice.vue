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
                                <country-flag-cell :country="country" />
                                <td>
                                    <a :href="`https://osu.ppy.sh/users/${getCaptain(country).osuId}`" target="__blank">
                                        {{ getCaptain(country).username }}
                                    </a>
                                </td>
                                <td>
                                    <span
                                        v-for="(contestant, i) in country.users.filter(u => u.isContestant)"
                                        :key="contestant.id"
                                    >
                                        <a :href="`https://osu.ppy.sh/users/${contestant.osuId}`" target="__blank">
                                            {{ contestant.username }}
                                        </a>
                                        {{ i >= country.users.filter(u => u.isContestant).length - 1 ? '' : ', ' }}
                                    </span>
                                </td>
                                <td>
                                    <span
                                        v-for="(user, i) in country.users.filter(u => !u.isContestant && !u.isCaptain)"
                                        :key="user.id"
                                    >
                                        <a :href="`https://osu.ppy.sh/users/${user.osuId}`" target="__blank">
                                            {{ user.username }}
                                        </a>
                                        {{ i >= country.users.filter(u => !u.isContestant && !u.isCaptain).length - 1 ? '' : ', ' }}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        v-if="country.wasConfirmed"
                                        class="btn btn-sm btn-danger"
                                        @click="remove(country.id, $event)"
                                    >
                                        Deny
                                    </button>
                                    <button
                                        v-else
                                        class="btn btn-sm btn-primary"
                                        @click="confirm(country.id, $event)"
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
import PageHeader from '../../components/PageHeader.vue';
import DataTable from '../../components/admin/DataTable.vue';
import CountryFlagCell from '../../components/CountryFlagCell.vue';
import { Country } from '../../interfaces';

@Component({
    components: {
        PageHeader,
        DataTable,
        CountryFlagCell,
    },
})
export default class TeamChoice extends Vue {

    countries = [];

    async created (): Promise<void> {
        await this.getData();
    }

    async getData (): Promise<void> {
        await this.initialRequest<{ countries: [] }>('/api/admin/teamsChoice', (data) => {
            this.countries = data.countries;
        });
    }

    async confirm (countryId: number, e: Event): Promise<void> {
        await this.postRequest(`/api/admin/teamsChoice/confirm`, {
            countryId,
        }, e, async () => {
            await this.getData();
        });
    }

    async remove (countryId: number, e: Event): Promise<void> {
        await this.postRequest(`/api/admin/teamsChoice/remove`, {
            countryId,
        }, e, async () => {
            await this.getData();
        });
    }

    getCaptain (country: Country): object {
        return country.users.find(u => u.isCaptain) || {};
    }

}
</script>
