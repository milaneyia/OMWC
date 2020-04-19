import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ROLE {
    BasicUser = 1,
    ElevatedUser = 2,
    Restricted = 3,
    Contestant = 4,
    Captain = 5,
    Judge = 6,
    Staff = 7,
}

@Entity()
export class Role extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;
}
