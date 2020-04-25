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

export interface Match {
    id?: number;
    roundId: number;
    teamAId?: number;
    teamBId?: number;
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
}

export interface Judging {
    id?: number;
    submissionId?: number;
    judgingCriteriaId?: number;
    score?: number;
    comment?: string;
}

export interface Criteria {
    id: number;
    name: string;
    maxScore: number;
}
