import { Country } from '../../app/models/Country';

export default async function countries() {
    await Country.insert([
        {
            code: 'CL',
            name: 'Chile',
        },
        {
            code: 'US',
            name: 'United States',
        },
    ]);
}
