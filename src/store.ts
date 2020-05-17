import { StoreOptions } from 'vuex';
import { User } from './interfaces';

export interface MainState {
    initialized: boolean;
    user: User | null;
    schedule: object | null;
    isLoading: boolean;
}

const store: StoreOptions<MainState> = {
    state: {
        initialized: false,
        user: null,
        schedule: null,
        isLoading: false,
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
        updateLoadingState (state): void {
            state.isLoading = !state.isLoading;
        },
    },
};

export default store;
