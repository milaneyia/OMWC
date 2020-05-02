export interface User {
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
