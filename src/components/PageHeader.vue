<template>
    <div class="row mb-2">
        <div class="col-sm">
            <div class="header">
                <img
                    src="/img/logo.png"
                    alt="osu!BWC"
                    width="60"
                    heigth="60"
                >
                <h3 class="ml-2">
                    <slot />
                </h3>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class PageHeader extends Vue {
}

</script>
