<template>
    <div class="container text-center">
        <template v-if="user">
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
                    <button class="btn btn-primary btn-block" @click="apply($event)">
                        Apply
                    </button>
                </div>
            </div>
        </template>

        <login-modal v-else />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { State } from 'vuex-class';
import { User, MapperApplication } from '../../interfaces';
import PageHeader from '../../components/PageHeader.vue';
import LoginModal from '../../components/LoginModal.vue';

@Component({
    components: {
        PageHeader,
        LoginModal,
    },
})
export default class Mapper extends Vue {

    @State user!: User;

    async apply (e: Event): Promise<void> {
        await this.postRequest<{ mapperApplication: MapperApplication }>('/api/applications/mappers/store', {}, e, (data) => {
            const user = { ...this.user };
            user.mapperApplication = data.mapperApplication;
            this.$store.commit('updateUser', user);
            this.$router.push('/');
        });
    }

}
</script>
