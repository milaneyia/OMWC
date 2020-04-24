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
                    @click="create"
                >
                    Create
                </button>

                <template v-else>
                    <match-form
                        :match="newMatch"
                        :competing-teams="competingTeams"
                        :editing="false"
                    />

                    <button class="btn btn-primary btn-block my-2" @click="store">
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

                    <template v-if="!editing">
                        <button
                            v-if="!editing"
                            class="btn btn-sm btn-primary"
                            @click="editing = match.id"
                        >
                            Edit
                        </button>

                        <button
                            v-if="!editing"
                            class="btn btn-sm btn-danger"
                            @click="remove(match.id)"
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

                        <button class="btn btn-sm btn-primary" @click="save(match)">
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
import Axios from 'axios';
import { Route } from 'vue-router';
import { Match, Country } from '../../../interfaces';
import PageHeader from '../../../components/PageHeader.vue';
import DataTable from '../../../components/DataTable.vue';
import MatchForm from '../../../components/MatchForm.vue';

@Component({
    components: {
        PageHeader,
        DataTable,
        MatchForm,
    },
})
export default class ManageMatch extends Vue {

    matches: Match[] = [];
    competingTeams: Country[] = [];
    editing = null;
    newMatch: Match | null = null;

    create (): void {
        this.newMatch = {
            roundId: parseInt(this.$route.params.id),
        };
    }

    async store (): Promise<void> {
        const res = await Axios.post(`/api/admin/rounds/${this.$route.params.id}/matches/store`, {
            match: this.newMatch,
        });

        if (res.data.error) {
            alert(res.data.error);
        } else {
            this.newMatch = null;
            this.matches = res.data.matches;
            alert('ok');
        }
    }

    async save (match: Match): Promise<void> {
        const res = await Axios.post(`/api/admin/rounds/${this.$route.params.id}/matches/${match.id}/save`, {
            match,
        });

        if (res.data.error) {
            alert(res.data.error);
        } else {
            this.matches = res.data.matches;
            this.editing = null;
            alert('ok');
        }
    }

    async remove (matchId: number): Promise<void> {
        const res = await Axios.post(`/api/admin/rounds/${this.$route.params.id}/matches/${matchId}/remove`);

        if (res.data.error) {
            alert(res.data.error);
        } else {
            this.matches = res.data.matches;
            alert('ok');
        }
    }

    async beforeRouteEnter (to: Route, from: Route, next: Function): Promise<void> {
        if (to.params.id) {
            const res = await Axios.get(`/api/admin/rounds/${to.params.id}/matches`);
            next((vm: ManageMatch) => {
                vm.matches = res.data.matches;
                vm.competingTeams = res.data.competingTeams;
            });
        } else {
            next();
        }
    }

    async beforeRouteUpdate (to: Route, from: Route, next: Function): Promise<void> {
        if (to.params.id) {
            this.matches = [];
            const res = await Axios.get(`/api/admin/rounds/${to.params.id}/matches`);
            this.matches = res.data.matches;
            this.competingTeams = res.data.competingTeams;
        }

        next();
    }

}
</script>
