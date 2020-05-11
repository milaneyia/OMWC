export interface User {
    id: number;
    username: string;
    captainVoteId?: number;

    isBasicUser: boolean;
    isElevatedUser: boolean;
    isContestant: boolean;
    isCaptain: boolean;
    isStaff: boolean;

    captainApplication: {
        reason: string;
    };

    mapperApplication: MapperApplication;

    captainVote: {
        id: number;
    };
}

export interface MapperApplication {
    id: number;
    user: User;
}

export interface Schedule {
    applicationsStartedAt: Date;
    applicationsEndedAt: Date;
    captainVotingStartedAt: Date;
    captainVotingEndedAt: Date;
    mappersChoiceStartedAt: Date;
    mappersChoiceEndedAt: Date;
}

export interface Country {
    id: number;
    users: User[];
}

export interface Round {
    id: number;
    matches: Match[];
}

export interface Match {
    id?: number;
    roundId: number;
    teamAId?: number;
    teamBId?: number;
    teamA?: Country;
    teamB?: Country;

    submissions?: Submission[];
    eliminationJudging?: EliminationJudging[];
}

export interface Submission {
    id: number;
    matchId: number;
    originalLink: string;
    anonymisedAs: string;
    anonymisedLink: string;
    country: Country;

    match: {
        id: number;
    };

    qualifierJudging: QualifierJudging[];
    eliminationJudging: EliminationJudging[];
}

export interface QualifierJudgingToCriterias {
    score: number;
    comment: string;
    criteriaId: number;
}

export interface QualifierJudging {
    id?: number;
    submissionId?: number;
    judgeId: number;
    judge: User;

    qualifierJudgingToCriterias: QualifierJudgingToCriterias[];
}

export interface Criteria {
    id: number;
    name: string;
    maxScore: number;
}

export interface EliminationJudging {
    id: number;
    judgeId: number;
    judge: User;

    submissionChosen: Submission;
}
