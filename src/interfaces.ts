export interface User {
    username: string;
    isStaff: boolean;
    captainVoteId?: number;

    captainApplication: {
        reason: string;
    };

    mapperApplication: {
        id: number;
    };

    captainVote: {
        id: number;
    };
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
    anonymisedAs: string;
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
