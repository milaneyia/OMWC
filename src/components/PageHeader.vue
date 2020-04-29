<template>
    <div>
        <div class="row mb-2">
            <div class="col-sm">
                <div class="header">
                    <img
                        src="/img/logo.png"
                        alt="osu!BWC"
                        width="60"
                        heigth="60"
                    >
                    <h3 class="ml-2 mb-0">
                        {{ title }}
                    </h3>
                </div>
            </div>
        </div>

        <div v-if="subtitle" class="row">
            <div class="col-sm">
                <div class="card">
                    <div class="card-header">
                        {{ subtitle }}
                        <slot />
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
        title: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String,
            required: false,
        },
    },
})
export default class PageHeader extends Vue {
}

</script>
