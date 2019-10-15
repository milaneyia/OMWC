import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne,
    OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Judging } from '../judging/Judging';
import { Team } from '../Team';
import { Round } from './Round';

@Entity()
export class Submission extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    originalLink!: string;

    @Column({ nullable: true })
    anonymisedAs!: string;

    @Column()
    teamId!: number;

    @ManyToOne((type) => Team, (team) => team.submissions, { nullable: false })
    team!: Team;

    @Column()
    roundId!: number;

    @ManyToOne((type) => Round, (round) => round.submissions, { nullable: false })
    round!: Round;

    @OneToMany((type) => Judging, (judging) => judging.submission)
    judging!: Judging[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
