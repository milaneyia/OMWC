import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Team } from '../Team';
import { Round } from './Round';

@Entity()
export class Submission extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    originalLink!: string;

    @Column({ nullable: true })
    anonymisedLink!: string;

    @Column()
    teamId!: number;

    @ManyToOne((type) => Team, { nullable: false })
    team!: Team;

    @Column()
    roundId!: number;

    @ManyToOne((type) => Round, (round) => round.submissions, { nullable: false })
    round!: Round;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
