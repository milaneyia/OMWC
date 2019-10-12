import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CaptainApplication } from './applications/CaptainApplication';
import { User } from './User';

@Entity()
export class Country extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @Column({ unique: true })
    code!: string;

    @OneToMany((type) => User, (user) => user.country)
    users!: User[];

    // Used for mapping
    captainApplications!: CaptainApplication[];
}
