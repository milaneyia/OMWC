<template>
    <div>
        <div class="container text-center">
            <div class="row mb-2">
                <div class="col-sm">
                    <div
                        v-if="user"
                        class="header"
                    >
                        <img
                            src="/img/logo.png"
                            width="60"
                            heigth="60"
                        >
                        <div>
                            <h3 class="ml-2 mb-0">
                                Welcome
                                <b>{{ user.username }}</b>
                            </h3>
                            <div class="d-flex ml-2 align-items-center">
                                <span class="ml-2">
                                    you're participating for <b>{{ user.country.name }}</b>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div
                        v-else
                        class="my-4"
                    >
                        <img
                            src="/img/logo_large.png"
                            width="150"
                            height="150"
                            class="mt-2"
                        >
                        <h2>
                            osu! Beatmapping World Championship
                        </h2>
                        <h5>
                            from may 02 to october 17
                        </h5>
                    </div>
                </div>
            </div>
        </div>

        <div class="d-flex" style="background-color: rgb(23, 26, 28)">
            <div class="container text-center" style="margin-top: -30px">
                <home-nav
                    :schedule="schedule"
                    :user="user"
                />

                <div class="row mb-2">
                    <div class="col-sm">
                        <div class="card">
                            <div class="card-header">
                                <div class="d-flex justify-content-around flex-wrap">
                                    <a
                                        class="d-flex align-items-center mb-3 mb-sm-0"
                                        href="https://discord.gg/CZp4bNx"
                                        target="__blank"
                                    >
                                        <i class="fab fa-discord fa-3x text-white" />
                                        <h4 class="mx-3 mb-0">Join us!</h4>
                                    </a>
                                    <a
                                        class="d-flex align-items-center mb-3 mb-sm-0"
                                        href="https://osu.ppy.sh/community/forums/topics/1060035"
                                        target="__blank"
                                    >
                                        <span class="country-flag" style="background-image: url('/img/osu.png'); height: 50px; width: 50px;" />
                                        <h4 class="mx-3 mb-0">
                                            Forum Post
                                        </h4>
                                    </a>
                                    <a
                                        class="d-flex align-items-center mb-3 mb-sm-0"
                                        href="https://twitter.com/osubwc"
                                        target="__blank"
                                    >
                                        <i class="fab fa-twitter fa-3x text-white" />
                                        <h4 class="mx-3 mb-0">
                                            Follow us!
                                        </h4>
                                    </a>
                                    <a
                                        class="d-flex align-items-center mb-3 mb-sm-0"
                                        href="https://pickem.hwc.hr/tournaments/30"
                                        target="__blank"
                                    >
                                        <span class="country-flag" style="background-image: url('/img/pickem.png'); height: 50px; width: 50px;" />
                                        <h4 class="ml-3 mb-0">
                                            Pick'em
                                        </h4>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <img
                    src="/img/results.png"
                    alt=""
                    class="img-fluid mb-2"
                >

                <div class="row mb-2">
                    <div class="col-sm">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="mb-0">
                                    Prizes
                                </h3>

                                <small>
                                    supporter tags are for each team member
                                </small>
                            </div>

                            <div class="card-body">
                                <div class="row">
                                    <div class="col-sm">
                                        <h5 class="text-warning">
                                            <i class="fas fa-crown mr-1" />
                                            1st place
                                        </h5>

                                        <div>
                                            <img
                                                src="/img/badge_1.png"
                                                width="100"
                                            >
                                            <p class="mt-1">
                                                <small><i class="fas fa-heart mr-1" /></small>
                                                8 months of osu!supporter
                                            </p>
                                        </div>

                                        <hr>

                                        <h5 class="text-info">
                                            <i class="fas fa-crown mr-1" />
                                            2nd place
                                        </h5>

                                        <div>
                                            <img
                                                src="/img/badge_2.png"
                                                width="100"
                                            >
                                            <p class="mt-1">
                                                <small><i class="fas fa-heart mr-1" /></small>
                                                6 months of osu!supporter
                                            </p>
                                        </div>

                                        <hr>

                                        <h5 class="text-white-50">
                                            <i class="fas fa-crown mr-1" />
                                            3rd place
                                        </h5>


                                        <div>
                                            <img
                                                class="mr-2"
                                                src="/img/badge_3.png"
                                                width="100"
                                            >
                                            <p class="mt-1">
                                                <small><i class="fas fa-heart mr-1" /></small>
                                                4 months of osu!supporter
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mb-2">
                    <div class="col-sm">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="mb-0">
                                    Schedule
                                </h3>
                                <small>dates are in your local timezone</small>
                            </div>

                            <div class="card-body">
                                <div class="row">
                                    <div class="col-sm">
                                        <schedule-date
                                            collapse="preparationCollapse"
                                            group-title="Preparation phase"
                                            :dates="preparationDates"
                                        />

                                        <hr>

                                        <schedule-date
                                            collapse="qualifiersCollapse"
                                            group-title="Qualifiers"
                                            :dates="qualifiersDates"
                                        />

                                        <hr>

                                        <schedule-date
                                            collapse="eliminationCollapse"
                                            group-title="Head-to-head elimination"
                                            :dates="eliminationDates"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { State } from 'vuex-class';
import HomeNav from '../components/index/HomeNav.vue';
import ScheduleDate from '../components/index/ScheduleDate.vue';

@Component({
    components: {
        HomeNav,
        ScheduleDate,
    },
})
export default class Index extends Vue {

    @State user!: object;
    @State schedule!: object;

    preparationCollapse = false;
    qualifiersCollapse = false;
    eliminationCollapse = false;

    preparationDates = [
        {
            from: new Date('05/02/2020 UTC'),
            to: new Date('05/16/2020 UTC'),
            text: 'Announcements and Registration phase (Team Captains and Contestants)',
        },
        {
            from: new Date('05/16/2020 UTC'),
            to: new Date('05/23/2020 UTC'),
            text: `Voting phase for each country's Team Captain`,
        },
        {
            from: new Date('05/23/2020 UTC'),
            to: new Date('05/30/2020 UTC'),
            text: 'Team Building phase',
        },
    ];

    qualifiersDates = [
        {
            from: new Date('05/30/2020 UTC'),
            to: new Date('06/13/2020 UTC'),
            text: 'Mapping Phase',
        },
        {
            from: new Date('06/14/2020 UTC'),
            to: new Date('06/28/2020 UTC'),
            text: `Judging Phase`,
        },
    ];

    eliminationDates = [
        {
            from: new Date('06/30/2020 UTC'),
            to: new Date('07/13/2020 UTC'),
            text: 'Round of 16 - Mapping phase',
        },
        {
            from: new Date('07/14/2020 UTC'),
            to: new Date('07/22/2020 UTC'),
            text: `Round of 16 - Judging phase`,
        },
        {
            from: new Date('07/24/2020 UTC'),
            to: new Date('08/08/2020 UTC'),
            text: 'Quarter finals - Mapping phase',
        },
        {
            from: new Date('08/09/2020 UTC'),
            to: new Date('08/17/2020 UTC'),
            text: `Quarter finals - Judging phase`,
        },
        {
            from: new Date('08/19/2020 UTC'),
            to: new Date('09/03/2020 UTC'),
            text: 'Semi finals - Mapping phase',
        },
        {
            from: new Date('09/04/2020 UTC'),
            to: new Date('09/13/2020 UTC'),
            text: `Semi finals - Judging phase`,
        },
        {
            from: new Date('09/15/2020 UTC'),
            to: new Date('09/30/2020 UTC'),
            text: '3rd place/Final - Mapping phase',
        },
        {
            from: new Date('10/01/2020 UTC'),
            to: new Date('10/09/2020 UTC'),
            text: `3rd place/Final - Judging phase`,
        },
        {
            from: new Date('10/17/2020 UTC'),
            text: `3rd place/Final livestream`,
        },
    ];

}
</script>
