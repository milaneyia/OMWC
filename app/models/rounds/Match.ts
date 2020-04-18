import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Submission } from './Submission';
import { Round } from './Round';

@Entity()
export class Match extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true, length: 3000 })
    information?: string;

    @Column({ nullable: true, length: 3000 })
    anonymisedLink?: string;

    @ManyToOne((type) => Round, { nullable: false })
    round!: Round;

    @OneToMany((type) => Submission, (submission) => submission.match)
    submissions!: Submission[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
