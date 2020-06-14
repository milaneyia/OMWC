<template>
    <div>
        <h5>
            <a
                data-toggle="collapse"
                :href="`#${collapse}`"
                @click="isExpanded = !isExpanded"
            >
                <small>
                    <i
                        class="fas mr-2"
                        :class="isExpanded ? 'fa-chevron-down' : 'fa-chevron-right'"
                    />
                </small>
                {{ groupTitle }}
            </a>
        </h5>

        <p>
            <time-string :timestamp="dates[0].from" /> -
            <time-string :timestamp="dates[dates.length - 1].to || dates[dates.length - 2].to" />
        </p>

        <div :id="collapse" class="collapse">
            <div class="card card-body text-left">
                <div
                    v-for="(date, i) in dates"
                    :key="i"
                    class="row align-items-center"
                    :class="getRowClasses(i, date.from, date.to)"
                >
                    <div class="col-sm-3">
                        <div>
                            <time-string
                                :timestamp="date.from"
                            />
                        </div>

                        <div>
                            <time-string
                                v-if="date.to"
                                :timestamp="date.to"
                            />
                        </div>
                    </div>

                    <div class="col-sm-9">
                        {{ date.text }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import TimeString from '../TimeString.vue';

@Component({
    props: {
        collapse: {
            type: String,
            required: true,
        },
        groupTitle: {
            type: String,
            required: true,
        },
        dates: {
            type: Array,
            required: true,
        },
    },
    components: {
        TimeString,
    },
})
export default class ScheduleDate extends Vue {

    isExpanded = false;
    dates!: [];

    getRowClasses (i: number, to: Date, from: Date | undefined): string[] {
        const today = new Date();
        const classes = [];

        if (i !== (this.dates.length - 1)) {
            classes.push('mb-3');
        }

        if (from && today >= to && today <= from) {
            classes.push('current-date');
        }

        return classes;
    }

}
</script>

<style lang="sass">

.current-date {
    border: {
        left: var(--info) solid 3px;
        bottom:  var(--info) solid 3px;
        radius: 3px;
    }
}

</style>