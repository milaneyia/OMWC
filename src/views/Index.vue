<template>
    <div>
        <h1>osu! Mapping World Cup</h1>
        
        <form v-if="!me" action="/login" method="GET">
            <button type="submit">Verify your osu! account to continue</button>
        </form>

        <p v-else>{{ me.username }}</p>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';

export default Vue.extend({
    data () {
        return {
            me: null,
        }
    },
    async created () {
        const response = await axios.get('/me');
        this.me = response.data.user;
    }
});
</script>