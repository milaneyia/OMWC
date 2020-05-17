import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { QualifierJudging } from './QualifierJudging';
import { Criteria } from './Criteria';

@Entity()
export class QualifierJudgingToCriteria extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    qualifierJudgingId!: number;

    @Column()
    criteriaId!: number;

    @ManyToOne(() => QualifierJudging, qualifierJudging => qualifierJudging.qualifierJudgingToCriterias)
    qualifierJudging!: QualifierJudging;

    @ManyToOne(() => Criteria, criteria => criteria.qualifierJudgingToCriterias)
    criteria!: Criteria;

    @Column()
    score!: number;

    @Column()
    comment!: string;
}
