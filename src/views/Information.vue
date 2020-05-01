<template>
    <div class="container">
        <page-header
            title="Information"
        />

        <modal-text>
            <h5>
                You can read the whole documentation
                <a href="https://docs.google.com/document/d/1D76nZfKeOGd5PkImYJxGfyKqN8_ikeIlG9wgUsUYXng/edit?usp=sharing" target="__blank">
                    <b>here</b>
                </a>
            </h5>

            <p class="mb-0">
                osu! Beatmapping World Championship is a 6 month tournament starting from may till october and will be divided in 3 phases
            </p>
        </modal-text>

        <modal-text
            header="Phases"
        >
            <b>Preparation phase:</b>
            <p>
                <small>you're required to have 1 ranked map or GD to opt in for captain and for captain voting</small>
            </p>

            <ul>
                <li>
                    Captain and mappers applications
                </li>
                <li>
                    Captain voting
                </li>
                <li>
                    Mappers' choice <small>(captain decides what mappers take part of the team)</small>
                </li>
            </ul>

            <hr>

            <p><b>Qualifier:</b></p>

            Group stage to filter and seed the 16 teams competing
            <p>
                <small>if there're less than 16 teams, top 8 will advance</small>
            </p>

            <hr>

            <p><b>Head-to-head eliminations</b></p>

            <p>There'll 3 genres to choose, each team bans 1 and the remaining will be chosen</p>
        </modal-text>

        <modal-text
            header="Judging"
        >
            <p>Judging processes difers from the qualifiers to the elimination phase</p>

            <p><b>Qualifier:</b></p>

            Judges'll review and give score to each entry and to each specific criteria

            <hr>

            <p><b>Head-to-head eliminations:</b></p>

            Judges'll review each entry and decide what entry was the best

            <hr>

            <p><b>Criterias</b></p>

            <ul>
                <li>30% - Expertise</li>
                <li>30% - Cohesion</li>
                <li>30% - Creativity</li>
                <li>10% - Judge's Impression</li>
            </ul>
        </modal-text>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import PageHeader from '../components/PageHeader.vue';
import ModalText from '../components/ModalText.vue';

@Component({
    components: {
        PageHeader,
        ModalText,
    },
})
export default class Information extends Vue {

}
</script>
