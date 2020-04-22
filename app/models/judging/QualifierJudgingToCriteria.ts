import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { QualifierJudging } from './QualifierJudging';
import { Criteria } from './Criteria';

@Entity()
export class QualifierJudgingToCriteria extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    // @Column()
    // judgingId!: number;

    // @Column()
    // criteriaId!: number;

    @ManyToOne(type => QualifierJudging, qualifierJudging => qualifierJudging.qualifierJudgingToCriterias)
    qualifierJudging!: QualifierJudging;

    @ManyToOne(type => Criteria, criteria => criteria.qualifierJudgingToCriterias)
    criteria!: Criteria;

    @Column('double')
    score!: number;

    @Column()
    comment!: string;
}
