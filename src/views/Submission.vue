<template>
    <div v-if="user" class="container text-center">
        <page-header
            title=".osz Submissions"
        />

        <div class="row mb-2">
            <div class="col-sm">
                <div class="card">
                    <div class="card-body">
                        <table v-if="submissions" class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Round</th>
                                    <th>Submission Date</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="submission in submissions"
                                    :key="submission.id"
                                >
                                    <td> {{ submission.match.round.title }}</td>
                                    <td>
                                        {{ submission.updatedAt | shortDateTimeString }}
                                    </td>
                                    <td>
                                        <a
                                            v-if="submission.originalPath"
                                            :href="`/api/submissions/${submission.id}/download`"
                                        >
                                            download
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <template v-if="currentRound && currentMatch">
            <div class="row">
                <div class="col-sm">
                    <div class="card">
                        <h5 class="card-header">
                            {{ currentRound.title }}
                        </h5>

                        <div class="card-body">
                            <p class="card-title">
                                {{ currentMatch.information }}
                            </p>
                            <p v-if="rolls.length">
                                The rolls were:
                                <span v-for="roll in rolls" :key="roll.id">
                                    {{ roll.team.name }} <b>{{ roll.value }}</b>
                                </span>
                            </p>
                            <p v-if="teamsBans.length">
                                The bans were:
                                {{ currentMatch.teamA.name }} <b>{{ teamABans }}</b>,
                                {{ currentMatch.teamB.name }} <b>{{ teamBBans }}</b>
                            </p>
                            <p v-if="genreToMap">
                                The chosen genre was: <b>{{ genreToMap.name }}</b>, download it <a :href="genreToMap.downloadLink" target="_blank">here</a>
                            </p>
                            <p>
                                You have from <b><time-string :timestamp="currentRound.submissionsStartedAt" /></b> to
                                <b><time-string :timestamp="currentRound.submissionsEndedAt" /></b> to submit your entry
                            </p>

                            <hr>

                            <label>
                                .osz File (20Mb max)
                            </label>

                            <input
                                id="oszFile"
                                type="file"
                                class="form-control"
                                @change="oszFile = $event.target.files[0]"
                            >
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-sm">
                    <button class="btn btn-primary btn-block" @click="save($event)">
                        <div
                            v-if="isSaving"
                            class="spinner-border spinner-border-sm align-middle"
                            role="status"
                        >
                            <span class="sr-only">Loading...</span>
                        </div>
                        <span v-else>Save</span>
                    </button>
                </div>
            </div>
        </template>

        <template v-if="nextRound && currentMatch">
            <div class="row">
                <div class="col-sm">
                    <div class="card">
                        <h5 class="card-header">
                            {{ nextRound.title }}
                        </h5>

                        <div class="card-body">
                            <p v-if="alreadyBanned" class="card-subtitle">
                                You banned <b>{{ bannedGenres }}</b>
                                <span v-if="rollValue !== undefined">
                                    and rolled <b>{{ rollValue }}</b>
                                </span>
                                Comeback on <b><time-string :timestamp="nextRound.submissionsStartedAt" /></b> to see the chosen song to map!
                            </p>
                            <template v-else>
                                <p class="card-subtitle">
                                    You have from till <b><time-string :timestamp="nextRound.submissionsStartedAt" /></b> to set your ban.
                                    <span v-if="isHighSeed">You'll have to select <b>2</b> genres in order of preference.</span>
                                </p>
                                <p v-if="isHighSeed">
                                    <span v-if="!bans.length">Select your first ban</span>
                                    <span v-else-if="bans.length !== 2">Select your second ban (it'll be used if the other team chooses your first choice)</span>
                                </p>

                                <div
                                    v-for="genre in nextRound.genres"
                                    :key="genre.id"
                                    class="form-check"
                                >
                                    <input
                                        :id="genre.id"
                                        v-model="bans"
                                        :value="genre.id"
                                        :type="isHighSeed ? 'checkbox' : 'radio'"
                                        class="form-check-input"
                                        :disabled="setDisabled(genre.id)"
                                    >
                                    <label :for="genre.id" class="form-check-label">{{ genre.name }}</label>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="!alreadyBanned" class="row">
                <div class="col-sm">
                    <button class="btn btn-primary btn-block" @click="saveBans($event)">
                        Save
                    </button>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Axios from 'axios';
import Component from 'vue-class-component';
import { State } from 'vuex-class';
import { User, Submission as ISubmission, Match, Round, Ban } from '../interfaces';
import PageHeader from '../components/PageHeader.vue';
import TimeString from '../components/TimeString.vue';

interface ApiResponse {
    submissions: ISubmission[];
    currentRound: Round | null;
    currentMatch: Match | null;
    nextRound: Round | null;
    genreToMap: {} | null;
    isHighSeed: boolean;
    teamsBans: Ban[];
    rolls: [];
    rollValue: number | null;
}

@Component({
    components: {
        PageHeader,
        TimeString,
    },
})
export default class Submission extends Vue {

    @State user!: User;

    submissions: ISubmission[] = [];
    currentRound: Round | null = null;
    currentMatch: Match | null = null;
    oszFile: File | null = null;
    isSaving = false;

    nextRound: Round | null = null
    genreToMap: {} | null = null;
    bans: number[] = [];
    isHighSeed = false;
    teamsBans: Ban[] = [];
    rolls = [];
    rollValue: number | null = null;

    async created (): Promise<void> {
        await this.getData();
    }

    get alreadyBanned (): boolean {
        if (!this.nextRound) return true;

        return this.nextRound.genres.some(g => g.bans.some(b => b.teamId === this.user.country.id));
    }

    get bannedGenres (): string {
        if (!this.nextRound) return '';
        const bannedGenres = this.nextRound.genres.filter(g => g.bans.some(b => b.teamId === this.user.country.id));
        if (!this.isHighSeed) return bannedGenres.map(g => g.name).join(', ');

        let display = '';

        for (const genre of bannedGenres) {
            for (const ban of genre.bans) {
                display += `${ban.genre.name} (${ban.place === 1 ? '1st choice' : '2nd choice'}), `;
            }
        }

        return display;
    }

    get teamABans (): string {
        if (!this.teamsBans.length || !this.currentMatch) return '';
        const teamABans = this.teamsBans.filter(b => b.teamId === this.currentMatch?.teamAId);

        return teamABans.map(b => b.genre.name).join(', ');
    }

    get teamBBans (): string {
        if (!this.teamsBans.length || !this.currentMatch) return '';
        const teamBBans = this.teamsBans.filter(b => b.teamId === this.currentMatch?.teamBId);

        return teamBBans.map(b => b.genre.name).join(', ');
    }

    async getData (): Promise<void> {
        await this.initialRequest<ApiResponse>('/api/submissions', (data) => {
            this.submissions = data.submissions,
            this.currentRound = data.currentRound,
            this.currentMatch = data.currentMatch;
            this.nextRound = data.nextRound;
            this.genreToMap = data.genreToMap;
            this.isHighSeed = data.isHighSeed;
            this.teamsBans = data.teamsBans;
            this.rolls = data.rolls;
            this.rollValue = data.rollValue;

            const genresBanned = data.nextRound?.genres.filter(g => g.bans.some(b => b.teamId === this.user.country.id));
            if (genresBanned) this.bans = genresBanned.map(g => g.id);
        });
    }

    async save (e: Event): Promise<void> {
        if (!this.oszFile) {
            alert('Select an .osz');

            return;
        }

        (e?.target as HTMLInputElement).disabled = true;
        this.isSaving = true;
        const formData = new FormData();
        formData.append('oszFile', this.oszFile);

        try {
            const res = await Axios.post('/api/submissions/save', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data.success) {
                await this.getData();
                alert('Saved!');
            } else {
                alert(res.data.error || 'Something went wrong!');
            }
        } catch (error) {
            console.log(error);
            alert('Something went wrong');
        }

        this.isSaving = false;
        (e?.target as HTMLInputElement).disabled = false;
    }

    async saveBans (e: Event): Promise<void> {
        if (confirm('This action cannot be undo, are you sure?')) {
            await this.postRequest('/api/submissions/saveBans', {
                bans: this.bans,
            }, e);

            await this.getData();
        }
    }

    setDisabled (genreId: number): boolean {
        if (this.alreadyBanned || !this.nextRound) return true;
        if (!this.bans.length || !this.isHighSeed) return false;

        return this.bans.length === 2 && !this.bans.some(g => g === genreId);
    }

}
</script>
