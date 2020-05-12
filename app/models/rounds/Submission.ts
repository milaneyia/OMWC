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
    originalPath!: string;

    @Column({ nullable: true })
    anonymisedAs!: string;

    @Column({ nullable: true })
    anonymisedPath?: string;

    @Column()
    countryId!: number;

    @ManyToOne(() => Country, (country) => country.submissions, { nullable: false })
    country!: Country;

    @ManyToOne(() => Match, (match) => match.submissions, { nullable: false })
    match!: Match;

    @OneToMany(() => QualifierJudging, (qualifierJudging) => qualifierJudging.submission)
    qualifierJudging!: QualifierJudging[];

    @OneToMany(() => EliminationJudging, (eliminationJudging) => eliminationJudging.submissionChosen)
    eliminationJudging!: EliminationJudging[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
