import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Submission } from '../rounds/Submission';
import { User } from '../User';
import { QualifierJudgingToCriteria } from './QualifierJudgingToCriteria';

@Entity()
export class QualifierJudging extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    judgeId!: number;

    @ManyToOne(() => User, { nullable: false })
    judge!: User;

    @Column()
    submissionId!: number;

    @ManyToOne(() => Submission, (submission) => submission.qualifierJudging, { nullable: false })
    submission!: Submission;

    @OneToMany(() => QualifierJudgingToCriteria, qualifierJudgingToCriteria => qualifierJudgingToCriteria.qualifierJudging)
    qualifierJudgingToCriterias!: QualifierJudgingToCriteria[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
