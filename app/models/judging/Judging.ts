import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Round } from '../rounds/Round';
import { Submission } from '../rounds/Submission';
import { User } from '../User';
import { JudgingCriteria } from './JudgingCriteria';

@Entity()
export class Judging extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('double')
    score!: number;

    @Column()
    comment!: string;

    @Column()
    judgingCriteriaId!: number;

    @ManyToOne((type) => JudgingCriteria, { nullable: false })
    judgingCriteria!: JudgingCriteria;

    @Column()
    judgeId!: number;

    @ManyToOne((type) => User, { nullable: false })
    judge!: User;

    @Column()
    roundId!: number;

    @ManyToOne((type) => Round, { nullable: false })
    round!: Round;

    @Column()
    submissionId!: number;

    @ManyToOne((type) => Submission, { nullable: false })
    submission!: Submission;
}
