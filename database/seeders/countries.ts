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
    ]);
}
