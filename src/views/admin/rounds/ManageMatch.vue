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
import { Match, Country } from '../../../interfaces';
import PageHeader from '../../../components/PageHeader.vue';
import DataTable from '../../../components/DataTable.vue';
import MatchForm from '../../../components/MatchForm.vue';

interface ApiResponse {
    matches: [];
    competingTeams: [];
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

}
</script>
