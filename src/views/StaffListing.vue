<template>
    <div class="container text-center">
        <page-header
            title="Staff"
        />

        <div class="row mb-2 staff">
            <div
                v-for="user in staff"
                :key="user.osuId"
                class="col-sm-3 mb-2"
            >
                <div class="avatar" :style="`background-image: url(https://a.ppy.sh/${user.osuId});`" />
                <div>
                    <a
                        :href="`https://osu.ppy.sh/users/${user.osuId}`"
                        target="_blank"
                    > {{ user.username }}
                    </a>
                </div>

                <i class="small">
                    {{ user.title }}
                </i>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import PageHeader from '../components/PageHeader.vue';

@Component({
    components: {
        PageHeader,
    },
})
export default class StaffListing extends Vue {

    staff = [
        { osuId: 2628870, username: 'Chaos', title: 'Organizer, Manager' },
        { osuId: 6100837, username: 'Imakuri', title: 'Organizer, Manager' },
        { osuId: 3076909, username: 'Regraz', title: 'Organizer, Statistician' },
        { osuId: 2716981, username: 'Nozhomi', title: 'Organizer, Statistician' },
        { osuId: 2850983, username: 'Pachiru', title: 'Organizer, Manager' },
        { osuId: 6485263, username: 'Electoz', title: 'Helper' },
    ];

}
</script>
