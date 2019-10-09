import {
    BaseEntity, Column, CreateDateColumn, Entity, JoinTable,
    ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Country } from './Country';
import { Role } from './Role';
import { Team } from './Team';

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    osuId!: number;

    @Column({ unique: true })
    username!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne((type) => Country, { nullable: false, eager: true })
    country!: Country;

    @ManyToOne((type) => Team)
    team!: Team;

    @ManyToMany((type) => Role)
    @JoinTable()
    roles!: Role[];
}
