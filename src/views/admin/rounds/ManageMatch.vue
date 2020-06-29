<template>
    <div class="container text-center">
        <page-header
            title="Manage Round Matches"
        />

        <div class="row box py-2">
            <div class="col-sm">
                <button
                    v-if="!newMatch"
                    class="btn btn-primary btn-block my-2"
                    @click="createNew"
                >
                    Create
                </button>

                <template v-else>
                    <match-form
                        :match="newMatch"
                        :competing-teams="competingTeams"
                        :editing="false"
                    />

                    <button class="btn btn-success btn-block my-2" @click="store($event)">
                        Save
                    </button>

                    <button
                        class="btn btn-secondary btn-block my-2"
                        @click="newMatch = null"
                    >
                        Cancel
                    </button>
                </template>

                <hr>

                <div
                    v-for="(match) in matches"
                    :key="match.id"
                    class="mb-3"
                >
                    <match-form
                        :match="match"
                        :competing-teams="competingTeams"
                        :editing="editing !== match.id"
                    />

                    <div v-if="!match.round.isQualifier" class="form-inline">
                        <div>
                            <b>{{ match.teamA.name }}:</b>

                            <span v-for="ban in match.teamA.bans" :key="ban.id">
                                {{ ban.genre.name }} ({{ ban.place }})
                            </span>
                        </div>

                        <div class="mx-3">
                            <b>{{ match.teamB.name }}:</b>

                            <span v-for="ban in match.teamB.bans" :key="ban.id">
                                {{ ban.genre.name }} ({{ ban.place }})
                            </span>
                        </div>

                        <div>
                            <b>Mapping:</b>
                            {{ getRemainingGenre(match) }}
                        </div>
                    </div>

                    <template v-if="!editing || editing != match.id">
                        <button
                            class="btn btn-sm btn-primary"
                            @click="editing = match.id"
                        >
                            Edit
                        </button>

                        <button
                            class="btn btn-sm btn-danger"
                            @click="remove(match.id, $event)"
                        >
                            Remove
                        </button>
                    </template>

                    <template v-else>
                        <button
                            class="btn btn-sm btn-secondary"
                            @click="editing = null"
                        >
                            Cancel
                        </button>

                        <button class="btn btn-sm btn-success" @click="save(match, $event)">
                            Save
                        </button>
                    </template>
                </div>
            </div>
        </div>

        <div class="row box py-2">
            <div class="col-sm-12">
                <button class="btn btn-secondary btn-block" @click="$router.go(-1)">
                    Back
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Match, Country, Ban } from '../../../interfaces';
import PageHeader from '../../../components/PageHeader.vue';
import DataTable from '../../../components/admin/DataTable.vue';
import MatchForm from '../../../components/admin/MatchForm.vue';
import { TeamScore } from '../../../../app/helpers';

interface ApiResponse {
    matches: [];
    competingTeams: [];
    teamsScores: TeamScore[];
}

@Component({
    components: {
        PageHeader,
        DataTable,
        MatchForm,
    },
    watch: {
        '$route': 'getData',
    },
})
export default class ManageMatch extends Vue {

    matches: Match[] = [];
    competingTeams: Country[] = [];
    editing = null;
    newMatch: Match | null = null;
    teamsScores: TeamScore[] = [];

    async created (): Promise<void> {
        await this.getData();
    }

    async getData (): Promise<void> {
        this.matches = [];
        this.competingTeams = [];

        if (this.$route.params.id) {
            await this.initialRequest<ApiResponse>(`/api/admin/rounds/${this.$route.params.id}/matches`, (data) => {
                this.matches = data.matches;
                this.competingTeams = data.competingTeams;
                this.teamsScores = data.teamsScores;
            });
        }
    }

    createNew (): void {
        this.newMatch = {
            roundId: parseInt(this.$route.params.id),
        };
    }

    async store (e: Event): Promise<void> {
        await this.postRequest<ApiResponse>(`/api/admin/rounds/${this.$route.params.id}/matches/store`, {
            match: this.newMatch,
        }, e, (data) => {
            this.newMatch = null;
            this.matches = data.matches;
            alert('Saved');
        });
    }

    async save (match: Match, e: Event): Promise<void> {
        await this.postRequest<ApiResponse>(`/api/admin/rounds/${this.$route.params.id}/matches/${match.id}/save`, {
            match,
        }, e, (data) => {
            this.matches = data.matches;
            this.editing = null;
            alert('Saved');
        });
    }

    async remove (matchId: number, e: Event): Promise<void> {
        await this.postRequest<ApiResponse>(`/api/admin/rounds/${this.$route.params.id}/matches/${matchId}/remove`, {}, e, (data) => {
            this.matches = data.matches;
            alert('Saved');
        });
    }

    getRemainingGenre (match: Match): string {
        let highSeedTeamId = 0;
        let highSeedTeamBans: Ban[] = [];
        let lowSeedTeamBans: Ban[] = [];

        if (match.teamAId && match.teamBId) {
            const teamAQualifierPosition = this.teamsScores.findIndex(s => s.country.id === match.teamAId);
            const teamBQualifierPosition = this.teamsScores.findIndex(s => s.country.id === match.teamBId);
            highSeedTeamId = teamAQualifierPosition < teamBQualifierPosition ? match.teamAId : match.teamBId;
        }

        if (!match.teamA?.bans.length || !match.teamB?.bans.length) {
            return `A team didn't ban`;
        }

        if (highSeedTeamId === match.teamAId) {
            highSeedTeamBans = match.teamA?.bans;
            lowSeedTeamBans = match.teamB?.bans;
        } else {
            lowSeedTeamBans = match.teamA?.bans;
            highSeedTeamBans = match.teamB?.bans;
        }

        let remainingGenres = match.round?.genres;

        if (!remainingGenres?.length) return  'mmm..';

        remainingGenres = remainingGenres.filter(g => g.id !== lowSeedTeamBans[0].genreId);
        let highSeedTeamBan = highSeedTeamBans[0];

        if (highSeedTeamBans[0].genreId === lowSeedTeamBans[0].genreId) {
            highSeedTeamBan = highSeedTeamBans[1];
        }

        remainingGenres = remainingGenres.filter(g => g.id !== highSeedTeamBan.genreId);

        return remainingGenres[0].name;
    }

}
</script>
