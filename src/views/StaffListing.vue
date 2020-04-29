<template>
    <div class="container text-center">
        <page-header
            title="Staff"
        />

        <div class="row mb-2 staff">
            <div
                v-for="user in staff"
                :key="user.osuId"
                class="col-sm-2 mb-2"
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

        <page-header
            title="Contributors"
        />

        <div class="row mb-2 staff">
            <div
                v-for="user in contributors"
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

        <page-header
            title="Judges"
        />

        <div class="row mb-2 staff">
            <div
                v-for="user in judges"
                :key="user.osuId"
                class="col-sm-3 mb-3"
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
        { osuId: 2628870, username: 'Chaos', title: 'Manager' },
        { osuId: 6100837, username: 'Imakuri', title: 'Manager' },
        { osuId: 3076909, username: 'Regraz', title: 'Statistician' },
        { osuId: 2716981, username: 'Nozhomi', title: 'Statistician' },
        { osuId: 2850983, username: 'Pachiru', title: 'Manager' },
    ];

    contributors = [
        { osuId: 898306, username: 'Yauxo' },
        { osuId: 443656, username: 'juankristal' },
        { osuId: 2140676, username: 'Smokeman' },
        { osuId: 6485263, username: 'Electoz' },
    ];

    judges = [
        { osuId: 2202645, username: 'Myxo' },
        { osuId: 4945926, username: 'yaspo' },
        { osuId: 2857314, username: 'Seto Kousuke' },
        { osuId: 6122935, username: 'Stack' },
        { osuId: 11771, username: 'Sonnyc' },
        { osuId: 6485263, username: 'Electoz' },
        { osuId: 7777875, username: 'Ryuusei Aika' },
    ];

}
</script>
