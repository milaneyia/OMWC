<template>
    <div class="container-lg text-center">
        <page-header
            title="Teams"
        />

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
import Axios from 'axios';

@Component({
    components: {
        PageHeader,
    },
})
export default class TeamListing extends Vue {

    teams = [];

    async created (): Promise<void> {
        await this.getData();
    }

    async getData (): Promise<void> {
        const res = await Axios.get('/api/teams');
        this.teams = res.data.teams;
    }

}
</script>
