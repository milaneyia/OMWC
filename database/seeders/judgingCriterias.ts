import { JudgingCriteria } from '../../app/models/judging/JudgingCriteria';

export default async function judgingCriterias() {
    await JudgingCriteria.insert([
        {
            id: 1,
            maxScore: 10,
            name: 'quality',
        },
        {
            id: 2,
            maxScore: 10,
            name: 'somethinsomethin',
        },
        {
            id: 3,
            maxScore: 10,
            name: 'something',
        },
        {
            id: 4,
            maxScore: 5,
            name: 'hitsounds',
        },
    ]);
}
