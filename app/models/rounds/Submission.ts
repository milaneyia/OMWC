import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Judging } from '../judging/Judging';
import { Round } from './Round';
import { Country } from '../Country';
import { Match } from './Match';

@Entity()
export class Submission extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    originalLink!: string;

    @Column({ nullable: true })
    anonymisedAs!: string;

    @ManyToOne((type) => Country, (country) => country.submissions, { nullable: false })
    country!: Country;

    @ManyToOne((type) => Match, (match) => match.submissions, { nullable: false })
    match!: Round;

    @OneToMany((type) => Judging, (judging) => judging.submission)
    judging!: Judging[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
