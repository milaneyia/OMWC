<template>
    <div class="form-inline">
        <input
            v-model="match.information"
            type="text"
            class="form-control w-100 mb-2"
            maxlength="3000"
            placeholder="Information (for bans and such)"
            :disabled="editing"
        >

        <input
            v-model="match.anonymisedLink"
            type="text"
            class="form-control mb-2 mr-sm-2"
            maxlength="3000"
            placeholder="Anonymised Link"
            :disabled="editing"
        >

        <div class="form-group mb-2 mr-sm-2">
            <label class="mr-2">Team A</label>

            <select
                v-model="match.teamAId"
                class="form-control"
                :disabled="editing"
            >
                <option :value="null" disabled>
                    Select one
                </option>

                <option
                    v-for="team in competingTeams"
                    :key="team.id"
                    :value="team.id"
                >
                    {{ team.name }}
                </option>
            </select>
        </div>

        <div class="form-group mb-2 mr-sm-2">
            <label class="mr-2">Team B</label>

            <select
                v-model="match.teamBId"
                class="form-control"
                :disabled="editing"
            >
                <option :value="null" disabled>
                    Select one
                </option>

                <option
                    v-for="team in competingTeams"
                    :key="team.id"
                    :value="team.id"
                >
                    {{ team.name }}
                </option>
            </select>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
    props: {
        match: {
            type: Object,
            required: true,
        },
        competingTeams: {
            type: Array,
            default: [],
            required: true,
        },
        editing: Boolean,
    },
})
export default class MatchForm extends Vue {
}
</script>
