export interface User {
    username: string;
    isStaff: boolean;
    captainVoteId?: number;
    isContestant: boolean;

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
    contestStartedAt: Date;
    contestEndedAt: Date;
}

export interface Country {
    id: number;
}

export interface Round {
    matches: Match[];
}

export interface Match {
    id?: number;
    roundId: number;
    teamAId?: number;
    teamBId?: number;

    submissions?: Submission[];
}

export interface Submission {
    id: number;
    matchId: number;
    originalLink: string;
    anonymisedAs: string;
    anonymisedLink: string;

    match: {
        id: number;
    };

    qualifierJudging: QualifierJudging[];
}

export interface QualifierJudging {
    id?: number;
    submissionId?: number;

    qualifierJudgingToCriterias: {
        score: number;
        comment: string;
    };
}

export interface Criteria {
    id: number;
    name: string;
    maxScore: number;
}
