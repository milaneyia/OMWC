
<template>
    <div class="row mb-2">
        <div class="col-sm">
            <div class="card">
                <div v-if="header" class="card-header">
                    <h5
                        v-if="header"
                        class="mb-0 text-center"
                    >
                        {{ header }}
                    </h5>

                    <slot name="header" />
                </div>

                <div class="card-body">
                    <slot />
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
        header: String,
    },
})
export default class ModalText extends Vue {

}
</script>
