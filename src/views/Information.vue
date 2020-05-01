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
                    Mappers' choice. Captain chooses 2-6 mappers for the team (for a total of 3-7 members)
                </li>
            </ul>

            <hr>

            <p><b>Qualifier:</b></p>

            <ul>
                <li>Group stage to filter the 16 teams competing on the next phase</li>
                <li>First will face the last of the group, second faces the penultimate and so on</li>
                <li>If there're less than 16 teams, top 8 will advance</li>
                <li>All teams will map the same song</li>
                <li>Judges review and give score to each entry based specific criterias</li>
                <li>
                    Score is standandarize based on a formula, read the
                    <a href="https://docs.google.com/document/d/1D76nZfKeOGd5PkImYJxGfyKqN8_ikeIlG9wgUsUYXng/edit?usp=sharing" target="__blank">
                        <b>documentation</b>
                    </a>
                    for more info
                </li>
            </ul>

            <hr>

            <p><b>Head-to-head eliminations</b></p>

            <ul>
                <li>Clash rounds that involves a 1 versus 1 format</li>
                <li>Teams choose 1 genre between 3 to 'ban' it. The remaining will be the chosen to map</li>
                <li>Judges review each entry and decide what entry was the best</li>
            </ul>
        </modal-text>

        <modal-text
            header="Criterias"
        >
            <ul>
                <li class="mb-3">
                    30% - Expertise
                    <div>
                        How well does the submission demonstrate techniques regarding structure,
                        music representation, flow, hitsounding, etc?
                    </div>
                </li>
                <li class="mb-3">
                    30% - Cohesion
                    <div>
                        How consistent is the submission regarding structure, music representation,
                        flow, hitsounding etc especially between different sections, considering this
                        contest is collaborative?
                    </div>
                </li>
                <li class="mb-3">
                    30% - Creativity
                    <div>
                        How well does the submission show originality and uniqueness compared with
                        the other submissions with reasonable respect to the playability?
                    </div>
                </li>
                <li class="mb-3">
                    10% - Judge's Impression
                    <div>
                        This is the part of the score left to the Judges’ personal preferences on the
                        submission
                    </div>
                </li>
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
