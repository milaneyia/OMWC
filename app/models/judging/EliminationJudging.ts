import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Submission } from '../rounds/Submission';
import { User } from '../User';
import { Match } from '../rounds/Match';

@Entity()
export class EliminationJudging extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text' })
    comment!: string;

    @Column()
    judgeId!: number;

    @ManyToOne(() => User, { nullable: false })
    judge!: User;

    @Column()
    matchId!: number;

    @ManyToOne(() => Match, (match) => match.eliminationJudging, { nullable: false })
    match!: Match;

    @Column()
    submissionChosenId!: number;

    @ManyToOne(() => Submission, (submission) => submission.eliminationJudging, { nullable: false })
    submissionChosen!: Submission;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
