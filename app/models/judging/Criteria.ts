import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { QualifierJudgingToCriteria } from './QualifierJudgingToCriteria';

@Entity()
export class Criteria extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column('double')
    maxScore!: number;

    @OneToMany(type => QualifierJudgingToCriteria, qualifierJudgingToCriteria => qualifierJudgingToCriteria.criteria)
    qualifierJudgingToCriterias!: QualifierJudgingToCriteria[];
}
