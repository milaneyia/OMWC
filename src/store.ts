import { StoreOptions } from 'vuex';
import { User, Country, Criteria, Round } from './interfaces';
import Axios from 'axios';

export interface MainState {
    initialized: boolean;
    user: User | null;
    schedule: object | null;
    isLoading: boolean;
    teams: Country[];
    criterias: Criteria[];
    judges: User[];
    qualifier: Round | null;
    eliminationRounds: Round[];
    currentRound: Round | null;
}

const store: StoreOptions<MainState> = {
    state: {
        // Initial
        initialized: false,
        user: null,
        schedule: null,
        isLoading: false,

        teams: [],

        // Qualifiers
        criterias: [],
        judges: [],
        qualifier: null,

        // Eliminations
        eliminationRounds: [],
        currentRound: null,
    },
    getters: {
        submissionsLength (state): number | undefined {
            return state.qualifier?.matches?.[0].submissions?.length;
        },
        nonFinals (state): Round[] {
            if (state.eliminationRounds.length) {
                return state.eliminationRounds.slice(0, state.eliminationRounds.length - 1);
            }

            return [];
        },
        finals (state): Round | null {
            if (state.eliminationRounds.length) {
                return state.eliminationRounds[state.eliminationRounds.length - 1];
            }

            return null;
        },
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
        updateTeams (state, payload): void {
            state.teams = payload || [];
        },
        updateQualifier (state, payload): void {
            state.criterias = payload.criterias || [];
            state.judges = payload.judges || [];
            state.qualifier = payload.qualifier;
        },
        updateEliminations (state, payload): void {
            state.eliminationRounds = payload.rounds || [];
            state.currentRound = payload.currentRound;
        },
    },
    actions: {
        async getTeams ({ commit }): Promise<void> {
            const res = await Axios.get('/api/teams');
            commit('updateTeams', res.data.teams);
        },
    },
};

export default store;
