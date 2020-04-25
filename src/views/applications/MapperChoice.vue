<template>
    <div v-if="user" class="container text-center">
        <div class="row mb-2">
            <div class="col-sm">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">
                            List of people who applied to be mapper for {{ user.country.name }}
                        </h4>

                        <p class="card-subtitle">
                            You must choose between 2 to 6 mappers
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div
                v-for="application in applications"
                :key="application.id"
                class="col-sm-6 mb-2"
            >
                <div class="card">
                    <div class="card-body">
                        <div class="custom-control custom-checkbox d-flex justify-content-center align-items-center">
                            <input
                                :id="application.id"
                                v-model="chosenAppsIds"
                                type="checkbox"
                                class="custom-control-input"
                                :value="application.id"
                                :checked="application.user.isContestant"
                            >

                            <label :for="application.id" class="custom-control-label d-flex align-items-center">
                                <div
                                    class="avatar"
                                    :style="`background-image: url(https://a.ppy.sh/${application.user.osuId})`"
                                />
                                <div class="ml-2">
                                    <a :href="`https://osu.ppy.sh/users/${application.user.osuId}`" target="_blank">
                                        {{ application.user.username }}
                                    </a>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-sm">
                <button class="btn btn-primary btn-block" @click="save">
                    Save
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { State } from 'vuex-class';
import { User } from '../../interfaces';
import Axios from 'axios';
import { MapperApplication } from '../../interfaces';

@Component
export default class MapperChoice extends Vue {

    @State user!: User;

    applications: MapperApplication[] = [];
    chosenAppsIds: number[] = [];

    async created (): Promise<void> {
        await this.getData();

        const contestants = this.applications.filter(a => a.user.isContestant);
        this.chosenAppsIds = contestants.map(c => c.id);
    }

    async getData (): Promise<void> {
        const res = await Axios.get('/api/applications/mappersChoice');
        this.applications = res.data.applications;
    }

    async save (): Promise<void> {
        const res = await Axios.post('/api/applications/mappersChoice/save', {
            chosenAppsIds: this.chosenAppsIds,
        });

        if (res.data.success) {
            await this.getData();
            alert('Saved!');
        } else {
            alert(res.data.error || 'Something went wrong!');
        }
    }

}
</script>
