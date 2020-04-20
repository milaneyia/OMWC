interface User {
    username: string;

    captainApplication: {
        reason: string;
    };

    mapperApplication: {
        id: number;
    };
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
    Submission,
    Judging,
    Criteria,
};
