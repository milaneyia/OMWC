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
            {{ dateSummary }}
        </p>

        <div :id="collapse" class="collapse">
            <div class="card card-body">
                <div
                    v-for="(date, i) in dates"
                    :key="i"
                    class="row align-items-center"
                    :class="getRowClasses(i, date.from, date.to)"
                >
                    <div class="col-sm-3">
                        {{ date.from.toLocaleString() }}

                        <span v-if="date.to">
                            - {{ date.to.toLocaleString() }}
                        </span>
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
        dateSummary: {
            type: String,
            required: true,
        },
        dates: {
            type: Array,
            required: true,
        },
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
        bottom:  var(--info) solid 2px;
        radius: 3px;
    }
}

</style>