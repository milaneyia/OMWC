<template>
    <div class="container text-center">
        <page-header
            title="Users"
            subtitle=" "
        >
            <p>You can edit users' roles, like captain, team member, judge, etc, in a simplier way here</p>
            <p><b>Basic</b> = doesn't have ranked maps, <b>Elevated</b> = has, <b>Restricted</b> = kill him</p>
            <b>Contestant</b> = mapper of their country, <b>Captain</b> = submits osz, <b>Judge</b> = god bless him
        </page-header>

        <div class="row">
            <div class="col-sm">
                <div class="card card-body">
                    <label for="query">Search an user:</label>

                    <div class="input-group">
                        <input
                            v-model="query"
                            type="text"
                            class="form-control"
                            placeholder="User id or username"
                            @keydown.enter="search"
                        >

                        <div class="input-group-append">
                            <button class="btn btn-primary" @click="search">
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                <div class="card card-body">
                    <div v-for="user in users" :key="user.id">
                        <div class="form-group">
                            <div>
                                <a :href="`https://osu.ppy.sh/users/${user.osuId}`" target="__blank">
                                    {{ user.username }}
                                </a>
                                <button
                                    v-if="!user.mapperApplicationId"
                                    class="btn btn-primary btn-sm mb-1"
                                    title="In case someone forgot to apply..."
                                    @click="createApp(user.id)"
                                >
                                    Create mapper app
                                </button>
                            </div>

                            <div class="input-group">
                                <select v-model="user.roleId" class="form-control">
                                    <option
                                        v-for="role in roles"
                                        :key="role.id"
                                        :value="role.id"
                                    >
                                        {{ role.name }}
                                    </option>
                                </select>

                                <div class="input-group-append">
                                    <button class="btn btn-success" @click="save(user)">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>

                        <hr>
                    </div>

                    <span v-if="!users.length">
                        None
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Axios from 'axios';
import PageHeader from '../../components/PageHeader.vue';
import DataTable from '../../components/DataTable.vue';
import { User } from '../../interfaces';

@Component({
    components: {
        PageHeader,
        DataTable,
    },
})
export default class ManageUser extends Vue {

    roles = [];
    users: User[] = [];
    query = '';

    async created (): Promise<void> {
        this.$store.commit('updateLoadingState');
        const res = await Axios.get(`/api/admin/users/roles`);
        this.roles = res.data.roles;
        this.$store.commit('updateLoadingState');
    }

    async search (): Promise<void> {
        const res = await Axios.get(`/api/admin/users/query?u=${this.query}`);

        if (res.data.users) {
            this.users = res.data.users;
        } else {
            alert(res.data.error || 'Something went wrong');
        }
    }

    async createApp (id: number): Promise<void> {
        const res = await Axios.post(`/api/admin/users/${id}/createMapperApplication`);

        if (res.data.app) {
            const i = this.users.findIndex(u => u.id === id);

            if (i !== -1) {
                Vue.set(this.users[i], 'mapperApplicationId', res.data.app.id);
            }

            alert('saved');
        } else {
            alert(res.data.success || res.data.error || 'Something went wrong');
        }
    }

    async save (user: User): Promise<void> {
        const res = await Axios.post(`/api/admin/users/${user.id}/updateRole`, {
            roleId: user.roleId,
        });

        alert(res.data.success || res.data.error || 'Something went wrong');
    }

}
</script>
