import { Country } from '../../app/models/Country';

export default async function countries() {
    await Country.insert([
        {
            code: 'CL',
            id: 1,
            name: 'Chile',
        },
        {
            code: 'US',
            id: 2,
            name: 'United States',
        },
        {
            code: 'FR',
            id: 3,
            name: 'France',
        },
        {
            code: 'KR',
            id: 4,
            name: 'South Korea',
        },
        {
            code: 'DE',
            id: 5,
            name: 'Germany',
        },
        {
            code: 'JP',
            id: 6,
            name: 'Japan',
        },
    ]);
}
