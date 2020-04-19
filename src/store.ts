import { StoreOptions } from 'vuex';

export interface MainState {
    user?: object;
    schedule?: object;
}

const mainModule: StoreOptions<MainState> = {
    state: {
        user: undefined,
        schedule: undefined,
    },
    mutations: {
        setData (state, payload): void {
            state.user = payload.user;
            state.schedule = payload.schedule;
        },
    },
};

export default mainModule;
