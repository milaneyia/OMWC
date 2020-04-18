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

interface JudgingCriteria {
    id: number;
    name: string;
    maxScore: number;
}

export { 
    Submission,
    Judging,
    JudgingCriteria,
}
