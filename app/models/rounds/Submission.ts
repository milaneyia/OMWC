import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Team } from '../Team';
import { Round } from './Round';

@Entity()
export class Submission extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    originalPath!: string;

    @Column()
    anonymisedPAth!: string;

    @ManyToOne((type) => Team, { nullable: false })
    team!: Team;

    @ManyToOne((type) => Round, { nullable: false })
    round!: Round;

    @Column('date')
    judgingStartedAt!: Date;

    @Column('date')
    judgingEndedAt!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
