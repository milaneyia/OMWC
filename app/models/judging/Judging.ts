import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Round } from '../rounds/Round';
import { Submission } from '../rounds/Submission';
import { User } from '../User';
import { JudgingToCriteria } from './JudgingToCriteria';

@Entity()
export class Judging extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('double')
    score!: number;

    @Column()
    comment!: string;

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

    @ManyToOne((type) => Submission, (submission) => submission.judging, { nullable: false })
    submission!: Submission;

    @Column()
    vote!: boolean;

    @OneToMany(type => JudgingToCriteria, judgingToCriteria => judgingToCriteria.judging)
    judgingToCriterias!: JudgingToCriteria[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
