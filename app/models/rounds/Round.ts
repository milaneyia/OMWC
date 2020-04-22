import { BaseEntity, Column, CreateDateColumn, Entity, LessThanOrEqual, MoreThanOrEqual, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Match } from './Match';

@Entity()
export class Round extends BaseEntity {

    static findCurrentSubmissionRound(): Promise<Round | undefined> {
        const today = new Date();

        return this.findOne({
            where: {
                submissionsEndedAt: MoreThanOrEqual(today),
                submissionsStartedAt: LessThanOrEqual(today),
            },
        });
    }

    static findCurrentJudgingRound(): Promise<Round | undefined> {
        const today = new Date();

        return this.findOne({
            where: {
                judgingEndedAt: MoreThanOrEqual(today),
                judgingStartedAt: LessThanOrEqual(today),
            },
        });
    }

    static findCurrentRound(): Promise<Round | undefined> {
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

    @OneToMany((type) => Match, (match) => match.round)
    matches!: Match[];

    @Column({ default: false })
    isQualifier!: boolean

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
