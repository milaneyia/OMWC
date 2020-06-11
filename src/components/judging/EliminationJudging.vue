<template>
    <h1> Elimination Judging </h1>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import PageHeader from '../../components/PageHeader.vue';

@Component({
    props: {
        round: {
            type: Object,
            required: false,
        },
    },
    components: {
        PageHeader,
    },
})
export default class Elimination extends Vue {

}
</script>
