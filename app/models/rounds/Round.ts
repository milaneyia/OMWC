import { BaseEntity, Column, CreateDateColumn, Entity, LessThanOrEqual,
    MoreThanOrEqual, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Submission } from './Submission';

@Entity()
export class Round extends BaseEntity {

    static findCurrentSubmissionRound() {
        const today = new Date();

        return this.findOne({
            where: {
                submissionsEndedAt: MoreThanOrEqual(today),
                submissionsStartedAt: LessThanOrEqual(today),
            },
        });
    }

    static findCurrentJudgingRound() {
        const today = new Date();

        return this.findOne({
            where: {
                judgingEndedAt: MoreThanOrEqual(today),
                judgingStartedAt: LessThanOrEqual(today),
            },
        });
    }

    static findCurrentRound() {
        const today = new Date();

        return this.findOne({
            where: [
                {
                    submissionsEndedAt: MoreThanOrEqual(today),
                    submissionsStartedAt: LessThanOrEqual(today),
                },
                {
                    judgingEndedAt: MoreThanOrEqual(today),
                    judgingStartedAt: LessThanOrEqual(today),
                },
            ],
        });
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column({ nullable: true, length: 3000 })
    information?: string;

    @Column({ nullable: true, length: 3000 })
    anonymisedLink?: string;

    @Column('date')
    submissionsStartedAt!: Date;

    @Column('date')
    submissionsEndedAt!: Date;

    @Column('date')
    judgingStartedAt!: Date;

    @Column('date')
    judgingEndedAt!: Date;

    @Column('date')
    resultsAt!: Date;

    @OneToMany((type) => Submission, (submission) => submission.round)
    submissions!: Submission[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
