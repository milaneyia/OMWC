import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Round } from '../rounds/Round';
import { Submission } from '../rounds/Submission';
import { User } from '../User';
import { Match } from '../rounds/Match';

@Entity()
export class EliminationJudging extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    comment!: string;

    @Column()
    judgeId!: number;

    @ManyToOne((type) => User, { nullable: false })
    judge!: User;

    @Column()
    matchId!: number;

    @ManyToOne((type) => Match, (match) => match.eliminationJudging, { nullable: false })
    match!: Match;

    @Column()
    submissionChosenId!: number;

    @ManyToOne((type) => Submission, (submission) => submission.eliminationJudging, { nullable: false })
    submissionChosen!: Submission;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
