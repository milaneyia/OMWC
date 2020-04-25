import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { QualifierJudging } from '../judging/QualifierJudging';
import { Country } from '../Country';
import { Match } from './Match';
import { EliminationJudging } from '../judging/EliminationJudging';

@Entity()
export class Submission extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    originalLink!: string;

    @Column({ nullable: true })
    anonymisedAs!: string;

    @Column({ nullable: true, length: 3000 })
    anonymisedLink?: string;

    @ManyToOne((type) => Country, (country) => country.submissions, { nullable: false })
    country!: Country;

    @ManyToOne((type) => Match, (match) => match.submissions, { nullable: false })
    match!: Match;

    @OneToMany((type) => QualifierJudging, (qualifierJudging) => qualifierJudging.submission)
    qualifierJudging!: QualifierJudging[];

    @OneToMany((type) => EliminationJudging, (eliminationJudging) => eliminationJudging.submissionChosen)
    eliminationJudging!: EliminationJudging[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
