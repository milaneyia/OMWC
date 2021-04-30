<template>
    <div>
        <div
            id="loginModal"
            class="modal fade"
            tabindex="-1"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header justify-content-center">
                        <h5 class="modal-title">
                            Log in to continue
                        </h5>
                    </div>
                    <div class="modal-body">
                        Remember that captain applications and voting require you to have at least 1 ranked map or guest difficulty

                        <hr>

                        <form
                            action="/api/login"
                            method="get"
                            class="form-inline my-2 my-lg-0 ml-3"
                        >
                            <button class="btn btn-primary btn-block" type="submit">
                                Verify your osu! account
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <button
            id="fakeModalButton"
            data-toggle="modal"
            data-target="#loginModal"
            class="d-none"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class LoginModal extends Vue {

    mounted (): void {
        (document.querySelector('#fakeModalButton') as HTMLElement).click();
    }

}

</script>
