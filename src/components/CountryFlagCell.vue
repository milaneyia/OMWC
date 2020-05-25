<template>
    <td>
        <div class="d-flex align-items-center">
            <div class="country-flag" :style="`background-image: url(https://osu.ppy.sh/images/flags/${country.code}.png)`" />
            <div class="ml-2">
                {{ country.name }}
            </div>
        </div>
    </td>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
    props: {
        country: {
            type: Object,
            required: true,
        },
    },
})
export default class CountryFlagCell extends Vue {

}

</script>
