<template lang="pug">
    .container
        .row(v-if="user")
            .col.s12.center-align
                h4 Hi {{ user.username }} you're applying for team captain for {{ user.country.name }}
                
        .row
            .col.s12.center-align.input-field
                textarea.materialize-textarea(data-length="3000" v-model="reason")
                label Tell us why

        .row
            .col.s12.center-align
                button.btn.waves-effect.waves-light(type="button" @click="apply")
                    span(v-if="app") Update
                    span(v-else) Apply!
                    i.material-icons.right send

        .row
            .col.s12.center-align
                p(v-if="info")
                    | {{ info }}
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';

export default Vue.extend({
    data () {
        return {
            user: null,
            app: null,
            reason: null,
            info: null,
        }
    },
    async created () {
        const response = await axios.get('/applications/captains/me');

        if (response.data) {
            this.user = response.data.user;
            // Need to fix dynamic resize if using materialize
            this.app = response.data.app
            this.reason = response.data.app && response.data.app.reason;
        }
    },
    methods: {
        async apply () {
            const res = await axios.post('/applications/captains/store', {
                reason: this.reason,
            });

            if (res.data) {
                this.info = res.data.error || res.data.success;
            }
        }
    }
});
</script>