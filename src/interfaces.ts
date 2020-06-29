export interface User {
    id: number;
    username: string;
    roleId: number;
    country: Country;

    isBasicUser: boolean;
    isElevatedUser: boolean;
    isContestant: boolean;
    isCaptain: boolean;
    isStaff: boolean;
    isJudge: boolean;
    isRestricted: boolean;

    captainApplication: CaptainApplication;
    mapperApplication: MapperApplication;

    captainVote?: CaptainApplication;
    captainVoteId?: number;
}

export interface MapperApplication {
    id: number;
    user: User;
}

export interface CaptainApplication {
    id: number;
    user: User;
    reason: string;
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
    wasConfirmed: boolean;
    bans: Ban[];
}

export interface Round {
    id: number;
    matches: Match[];
    genres: Genre[];
}

export interface Match {
    id?: number;
    roundId: number;
    round?: Round;
    teamAId?: number;
    teamBId?: number;
    teamA?: Country;
    teamB?: Country;

    submissions?: Submission[];
    eliminationJudging?: EliminationJudging[];
}

export interface Genre {
    id: number;
    name: string;
    downloadLink: string;
    bans: Ban[];
}

export interface Ban {
    id: number;
    place: number;
    team: Country;
    teamId: number;
    genre: Genre;
    genreId: number;
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
