import { StoreOptions } from 'vuex';
import { User } from './interfaces';

export interface MainState {
    initialized: boolean;
    user: User | null;
    schedule: object | null;
}

const store: StoreOptions<MainState> = {
    state: {
        initialized: false,
        user: null,
        schedule: null,
    },
    mutations: {
        setData (state, payload): void {
            state.user = payload.user;
            state.schedule = payload.schedule;
            state.initialized = true;
        },
        updateUser (state, payload): void {
            state.user = payload;
        },
        updateSchedule (state, payload): void {
            state.schedule = payload;
        },
    },
};

export default store;
