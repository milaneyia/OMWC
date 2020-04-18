import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Judging } from './Judging';
import { Criteria } from './Criteria';

@Entity()
export class JudgingToCriteria extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    // @Column()
    // judgingId!: number;

    // @Column()
    // criteriaId!: number;

    @ManyToOne(type => Judging, judging => judging.judgingToCriterias)
    judging!: Judging;

    @ManyToOne(type => Criteria, criteria => criteria.judgingToCriterias)
    criteria!: Criteria;

    @Column('double')
    score!: number;
}
