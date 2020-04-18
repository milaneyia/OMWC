import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { JudgingToCriteria } from './JudgingToCriteria';

@Entity()
export class Criteria extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column('double')
    maxScore!: number;

    @OneToMany(type => JudgingToCriteria, judgingToCriteria => judgingToCriteria.criteria)
    judgingToCriterias!: JudgingToCriteria[];
}
