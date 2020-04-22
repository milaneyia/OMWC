import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Round } from '../rounds/Round';
import { Submission } from '../rounds/Submission';
import { User } from '../User';
import { QualifierJudgingToCriteria } from './QualifierJudgingToCriteria';

@Entity()
export class QualifierJudging extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    judgeId!: number;

    @ManyToOne((type) => User, { nullable: false })
    judge!: User;

    @Column()
    submissionId!: number;

    @ManyToOne((type) => Submission, (submission) => submission.qualifierJudging, { nullable: false })
    submission!: Submission;

    @OneToMany(type => QualifierJudgingToCriteria, qualifierJudgingToCriteria => qualifierJudgingToCriteria.qualifierJudging)
    qualifierJudgingToCriterias!: QualifierJudgingToCriteria[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
