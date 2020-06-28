<template>
    <div class="container text-center">
        <page-header
            title="Manage Genres"
        />

        <div class="row box py-2">
            <div class="col-sm-12">
                <div
                    v-for="genre in genres"
                    :key="genre.id"
                    class="row mb-2"
                >
                    <div class="col-sm-5">
                        <div class="form-group">
                            <label>Name</label>
                            <input
                                v-model="genre.name"
                                type="text"
                                class="form-control"
                                maxlength="255"
                            >
                        </div>
                    </div>

                    <div class="col-sm-5">
                        <div class="form-group">
                            <label>Song link</label>
                            <input
                                v-model="genre.downloadLink"
                                type="text"
                                class="form-control"
                                maxlength="255"
                            >
                        </div>
                    </div>

                    <div class="col-sm-2 form-inline">
                        <button class="btn btn-danger btn-block" @click="remove(genre.id, $event)">
                            Remove
                        </button>
                        <button class="btn btn-primary btn-block" @click="update(genre, $event)">
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="genres.length < 3" class="row box py-2">
            <div class="col-sm-5">
                <div class="form-group">
                    <label>Name</label>
                    <input
                        v-model="newGenreName"
                        type="text"
                        class="form-control"
                        maxlength="255"
                    >
                </div>
            </div>

            <div class="col-sm-5">
                <div class="form-group">
                    <label>Song link</label>
                    <input
                        v-model="newGenreDownloadLink"
                        type="text"
                        class="form-control"
                        maxlength="255"
                    >
                </div>
            </div>

            <div class="col-sm-2 form-inline">
                <button class="btn btn-primary btn-block" @click="store($event)">
                    Add
                </button>
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
import PageHeader from '../../../components/PageHeader.vue';
import DataTable from '../../../components/admin/DataTable.vue';
import { Genre } from '../../../interfaces';

@Component({
    components: {
        PageHeader,
        DataTable,
    },
    watch: {
        '$route': 'getData',
    },
})
export default class ManageGenres extends Vue {

    newGenreName = '';
    newGenreDownloadLink = '';
    genres = [];

    async created (): Promise<void> {
        await this.getData();
    }

    async getData (): Promise<void> {
        this.genres = [];

        await this.initialRequest<{ genres: [] }>(`/api/admin/rounds/${this.$route.params.id}/genres`, (data) => {
            this.genres = data.genres;
        });
    }

    async store (e: Event): Promise<void> {
        await this.postRequest<{ genres: [] }>(`/api/admin/rounds/${this.$route.params.id}/genres/store`, {
            name: this.newGenreName,
            downloadLink: this.newGenreDownloadLink,
        }, e, (data) => {
            this.genres = data.genres;
            this.newGenreName = '';
            this.newGenreDownloadLink = '';
        });
    }

    async update (genre: Genre, e: Event): Promise<void> {
        await this.postRequest<{ genres: [] }>(`/api/admin/rounds/${this.$route.params.id}/genres/${genre.id}/save`, {
            name: genre.name,
            downloadLink: genre.downloadLink,
        }, e, (data) => {
            this.genres = data.genres;
        });
    }

    async remove (id: number, e: Event): Promise<void> {
        await this.postRequest<{ genres: [] }>(`/api/admin/rounds/${this.$route.params.id}/genres/${id}/remove`, {}, e, (data) => {
            this.genres = data.genres;
        });
    }

}
</script>
