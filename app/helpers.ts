import fs from 'fs';
import { Country } from './models/Country';
import { Round } from './models/rounds/Round';

export function convertToIntOrThrow(input: string): number {
    const parsedInput = parseInt(input, 10);

    if (isNaN(parsedInput)) {
        throw new Error('Not a number');
    }

    return parsedInput;
}

export function convertToArray<T>(input: T): T[] {
    if (Array.isArray(input)) {
        return input;
    }

    return [input];
}

export function isUrl(input: string): boolean {
    if (typeof input !== 'string') {
        return false;
    }

    const pattern = /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;

    return pattern.test(input.trim());
}

export function isOsuUrl(input: string): boolean {
    if (!isUrl(input)) {
        return false;
    }

    const url = new URL(input);

    return url.host === 'osu.ppy.sh';
}

export async function checkFileExistence(path: string): Promise<void> {
    await fs.promises.access(path, fs.constants.F_OK | fs.constants.R_OK);
}

export async function saveFile(inputPath: string, outputDir: string, outputPath: string): Promise<void> {
    try {
        await fs.promises.mkdir(outputDir, { recursive: true });
        await fs.promises.copyFile(inputPath, outputPath);
    } catch (error) {
        console.log(error);
        throw new Error(`Couldn't save the file`);
    }
}

export interface TeamScore {
    country: Country;
    criteriaSum: {
        criteriaId: number;
        sum: number;
    }[];
    judgingSum: {
        judgeId: number;
        sum: number;
        standardized: number;
    }[];
    rawFinalScore: number;
    standardizedFinalScore: number;
}

export interface JudgeCorrel {
    id: number;
    rawAvg: number;
    avg: number;
    sd: number;
    correl: number;
}

export async function calculateQualifierScores(qualifier?: Round): Promise<{ teamsScores: TeamScore[]; judgesCorrel: JudgeCorrel[] }> {
    const teamsScores: TeamScore[] = [];
    const judgesCorrel: JudgeCorrel[] = [];

    if (!qualifier) {
        return {
            teamsScores,
            judgesCorrel,
        };
    }

    const judges = qualifier.matches?.[0]?.submissions?.[0]?.qualifierJudging?.map(j => j.judge);
    const submissions = qualifier.matches?.[0]?.submissions;

    if (!submissions?.length) {
        const teams = await Country.getParticipatingTeams();

        for (const team of teams) {
            teamsScores.push({
                country: team,
                criteriaSum: [],
                judgingSum: [],
                rawFinalScore: 0,
                standardizedFinalScore: 0,
            });
        }

        return {
            teamsScores,
            judgesCorrel,
        };
    } else {
        for (const submission of submissions) {
            const teamScore: TeamScore = {
                country: submission.country,
                criteriaSum: [],
                judgingSum: [],
                rawFinalScore: 0,
                standardizedFinalScore: 0,
            };

            for (const qualifierJudging of submission.qualifierJudging) {
                let judgeSum = 0;

                for (const judgingToCriteria of qualifierJudging.qualifierJudgingToCriterias) {
                    judgeSum += judgingToCriteria.score;
                    const i = teamScore.criteriaSum.findIndex(j => j.criteriaId === judgingToCriteria.criteriaId);

                    if (i !== -1) {
                        teamScore.criteriaSum[i].sum += judgingToCriteria.score;
                    } else {
                        teamScore.criteriaSum.push({
                            criteriaId: judgingToCriteria.criteriaId,
                            sum: judgingToCriteria.score,
                        });
                    }
                }

                teamScore.judgingSum.push({
                    judgeId: qualifierJudging.judgeId,
                    sum: judgeSum,
                    standardized: 0,
                });
            }

            teamScore.rawFinalScore = teamScore.criteriaSum.reduce((acc, c) => acc + c.sum, 0);
            teamsScores.push(teamScore);
        }
    }

    if (teamsScores.length) {
        const judgesIds = judges.map(j => j.id);

        for (const judgeId of judgesIds) {
            let judgeSum = 0;
            let judgeAvg = 0;
            let judgeSd = 0;
            let judgeStdSum = 0;

            // Get score avg for the current judge
            for (const teamScore of teamsScores) {
                judgeSum += teamScore.judgingSum.find(j => j.judgeId === judgeId)?.sum || 0;
            }

            judgeAvg = judgeSum / teamsScores.length;

            // Get SD for the current judge
            for (const teamScore of teamsScores) {
                const judgingSum = teamScore.judgingSum.find(j => j.judgeId === judgeId);

                if (judgingSum) {
                    judgeSd += Math.pow(judgingSum.sum - judgeAvg, 2);
                }
            }

            judgeSd = Math.sqrt(judgeSd / teamsScores.length);

            // Set standard score for each entry for the current judge
            for (let i = 0; i < teamsScores.length; i++) {
                const j = teamsScores[i].judgingSum.findIndex(j => j.judgeId === judgeId);

                if (j !== -1) {
                    // S* = S - S(avg) / SD
                    const stdScore = (teamsScores[i].judgingSum[j].sum - judgeAvg) / judgeSd;
                    teamsScores[i].standardizedFinalScore += stdScore;
                    teamsScores[i].judgingSum[j].standardized = stdScore;
                    judgeStdSum += stdScore || 0;
                }
            }

            // Set standard score average for the current judge
            judgesCorrel.push({
                id: judgeId,
                rawAvg: judgeAvg,
                avg: judgeStdSum / teamsScores.length,
                sd: judgeSd,
                correl: 0,
            });
        }

        // Get final standard scores average
        const totalStdAvg = teamsScores.reduce((acc, s) => acc + s.standardizedFinalScore, 0) / teamsScores.length;

        // Set correlation coefficient per judge
        for (const judgeId of judgesIds) {
            const i = judgesCorrel.findIndex(j => j.id === judgeId);
            const judgeAvg = judgesCorrel?.[i]?.avg || 0;

            let sum1 = 0;
            let sum2 = 0;
            let sum3 = 0;

            for (const teamScore of teamsScores) {
                const judgingSum = teamScore.judgingSum.find(j => j.judgeId === judgeId);

                if (judgingSum) {
                    const x = (judgingSum.standardized - judgeAvg);
                    const y = (teamScore.standardizedFinalScore - totalStdAvg);
                    sum1 += x * y;
                    sum2 += Math.pow(x, 2);
                    sum3 += Math.pow(y, 2);
                }
            }

            judgesCorrel[i].correl = sum1 / (Math.sqrt(sum2 * sum3));
        }
    }

    teamsScores.sort((a, b) => b.standardizedFinalScore - a.standardizedFinalScore);

    return {
        teamsScores,
        judgesCorrel,
    };
}
