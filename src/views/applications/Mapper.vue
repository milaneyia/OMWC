<template>
    <div v-if="user" class="container text-center">
        <page-header
            title="Contestant Application"
            subtitle=" "
        >
            <h5>
                You're applying to be part of the team {{ user.country.name }} as a mapper
            </h5>

            <p>
                Once there's a captain for your country, they'll have to decide what applicants should conform the team!
            </p>
        </page-header>

        <div class="row">
            <div class="col-sm">
                <button class="btn btn-primary btn-block" @click="apply">
                    Apply
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
import PageHeader from '../../components/PageHeader.vue';

@Component({
    components: {
        PageHeader,
    },
})
export default class Index extends Vue {

    @State user!: User;

    async apply (): Promise<void> {
        const res = await Axios.post('/api/applications/mappers/store');

        if (res.data.error) {
            alert(res.data.error);
        } else {
            const user = this.user;
            user.mapperApplication = res.data;
            this.$store.commit('updateUser', user);
            this.$router.push('/');
        }
    }

}
</script>
