<template>
    <div class="container-lg text-center py-2">
        <page-header
            title="Teams"
        />

        <div v-if="user && user.isStaff" class="text-left my-2">
            <a
                class="btn btn-primary"
                data-toggle="collapse"
                href="#teamsList"
            >
                Show teams list
            </a>
            <div id="teamsList" class="collapse mt-2">
                <div class="card card-body">
                    <div v-for="team in teams" :key="team.id">
                        :flag_{{ team.code.toLowerCase() }}:
                        {{ team.name }}:
                        {{ listUsers(team) }}
                    </div>
                </div>
            </div>
        </div>

        <div
            v-for="team in teams"
            :key="team.id"
            class="row team"
        >
            <div class="col-md-3 team__country">
                <img :src="`https://osu.ppy.sh/images/flags/${team.code}.png`" :alt="team.code">

                <h5 class="mb-0 ml-2">
                    {{ team.name }}
                </h5>
            </div>

            <div class="col-md-9 team__members">
                <div class="row">
                    <div
                        v-for="user in team.users"
                        :key="user.id"
                        class="col-sm my-2"
                    >
                        <div class="avatar" :style="`background-image: url(https://a.ppy.sh/${user.osuId});`" />
                        <div>
                            <a
                                :href="`https://osu.ppy.sh/users/${user.osuId}`"
                                target="_blank"
                            >
                                {{ user.username }}
                            </a>
                        </div>
                        <small v-if="user.isCaptain">
                            Captain
                        </small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import PageHeader from '../components/PageHeader.vue';
import { State } from 'vuex-class';
import { Country, User } from '../interfaces';

@Component({
    components: {
        PageHeader,
    },
})
export default class TeamListing extends Vue {

    @State teams!: Country[];
    @State user!: User;

    created (): void {
        if (!this.teams.length) {
            this.$store.commit('updateLoadingState');
            this.$store.dispatch('getTeams');
            this.$store.commit('updateLoadingState');
        }
    }

    listUsers (team: Country): string {
        const list = team.users.map(u => u.username);

        if (list.length) {
            list[0] = `${list[0]} (captain)`;
        }

        return list.join(', ');
    }

}
</script>
