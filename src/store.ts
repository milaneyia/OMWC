import { StoreOptions } from 'vuex';
import { User, Country, Criteria, Round } from './interfaces';
import { TeamScore, JudgeCorrel } from '../app/helpers';
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
    teamsScores: TeamScore[];
    judgesCorrel: JudgeCorrel[];
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
        teamsScores: [],
        judgesCorrel: [],

        // Eliminations
        eliminationRounds: [],
        currentRound: null,
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
            state.teamsScores = payload.teamsScores;
            state.judgesCorrel = payload.judgesCorrel;
        },
        updateEliminations (state, payload): void {
            state.eliminationRounds = payload.rounds || [];
            state.currentRound = payload.currentRound;
        },
        sortByCriteria (state, payload): void {
            state.teamsScores.sort((a, b) => {
                const criteriaA = a.criteriaSum.find(c => c.criteriaId === payload.criteriaId);
                const criteriaB = b.criteriaSum.find(c => c.criteriaId === payload.criteriaId);
                let sumA = 0;
                let sumB = 0;

                if (criteriaA) sumA = criteriaA.sum;
                if (criteriaB) sumB = criteriaB.sum;

                if (payload.sortDesc) {
                    return sumB - sumA;
                }

                return sumA - sumB;
            });
        },
        sortByJudge (state, payload): void {
            state.teamsScores.sort((a, b) => {
                const judgeA = a.judgingSum.find(c => c.judgeId === payload.judgeId);
                const judgeB = b.judgingSum.find(c => c.judgeId === payload.judgeId);
                let sumA = 0;
                let sumB = 0;

                if (judgeA) sumA = judgeA.sum;
                if (judgeB) sumB = judgeB.sum;

                if (payload.sortDesc) {
                    return sumB - sumA;
                }

                return sumA - sumB;
            });
        },
        sortByRawScore (state, payload): void {
            state.teamsScores.sort((a, b) => {
                if (payload.sortDesc) {
                    return b.rawFinalScore - a.rawFinalScore;
                }

                return a.rawFinalScore - b.rawFinalScore;
            });
        },
        sortByStdScore (state, payload): void {
            state.teamsScores.sort((a, b) => {
                if (payload.sortDesc) {
                    return b.standardizedFinalScore - a.standardizedFinalScore;
                }

                return a.standardizedFinalScore - b.standardizedFinalScore;
            });
        },
    },
    getters: {
        submissionsLength (state): number | undefined {
            return state.qualifier?.matches?.[0]?.submissions?.length;
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
    actions: {
        async getTeams ({ commit }): Promise<void> {
            const res = await Axios.get('/api/teams');
            commit('updateTeams', res.data.teams);
        },
    },
};

export default store;
