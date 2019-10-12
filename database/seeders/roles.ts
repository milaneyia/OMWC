import { Role } from '../../app/models/Role';

export default async function roles() {
    await Role.insert([
        {
            id: 1,
            name: 'user',
        },
        {
            id: 2,
            name: 'restricted',
        },
        {
            id: 3,
            name: 'judge',
        },
        {
            id: 4,
            name: 'staff',
        },
    ]);
}
