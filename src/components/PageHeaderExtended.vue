<template>
    <div>
        <page-header>
            <slot name="title" />
        </page-header>

        <div class="row">
            <div class="col-sm">
                <div class="card">
                    <div class="card-header">
                        <slot name="subtitle" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import PageHeader from './PageHeader.vue';

@Component({
    components: {
        PageHeader,
    },
})
export default class PageHeaderExtended extends Vue {
}

</script>
