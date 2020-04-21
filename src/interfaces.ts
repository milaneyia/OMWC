interface User {
    username: string;
    isStaff: boolean;

    captainApplication: {
        reason: string;
    };

    mapperApplication: {
        id: number;
    };
}

interface Schedule {
    applicationsStartedAt: Date;
    applicationsEndedAt: Date;
    captainVotingStartedAt: Date;
    captainVotingEndedAt: Date;
    mappersChoiceStartedAt: Date;
    mappersChoiceEndedAt: Date;
    contestStartedAt: Date;
    contestEndedAt: Date;
}

interface Submission {
    id: number;
    anonymisedAs: string;
}

interface Judging {
    id?: number;
    submissionId?: number;
    judgingCriteriaId?: number;
    score?: number;
    comment?: string;
}

interface Criteria {
    id: number;
    name: string;
    maxScore: number;
}

export {
    User,
    Schedule,
    Submission,
    Judging,
    Criteria,
};
