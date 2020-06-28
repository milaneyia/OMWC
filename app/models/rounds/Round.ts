import { BaseEntity, Column, CreateDateColumn, Entity, LessThanOrEqual, MoreThanOrEqual, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Match } from './Match';
import { Genre } from './Genre';

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

    static findQualifierWithJudgingData(restricted = false): Promise<Round | undefined> {
        if (restricted) {
            return this
                .createQueryBuilder('round')
                .innerJoinAndSelect('round.matches', 'matches')
                .leftJoinAndSelect('matches.submissions', 'submissions', 'round.resultsAt <= :today', { today: new Date() })
                .leftJoinAndSelect('submissions.country', 'country')
                .leftJoinAndSelect('submissions.qualifierJudging', 'qualifierJudging')
                .leftJoinAndSelect('qualifierJudging.judge', 'judge')
                .leftJoinAndSelect('qualifierJudging.qualifierJudgingToCriterias', 'qualifierJudgingToCriterias')
                .leftJoinAndSelect('qualifierJudgingToCriterias.criteria', 'criteria')
                .where('round.isQualifier = true')
                .getOne();
        }

        return this.findOne({
            where: {
                isQualifier: true,
            },
            relations: [
                'matches',
                'matches.submissions',
                'matches.submissions.country',
                'matches.submissions.qualifierJudging',
                'matches.submissions.qualifierJudging.judge',
                'matches.submissions.qualifierJudging.qualifierJudgingToCriterias',
                'matches.submissions.qualifierJudging.qualifierJudgingToCriterias.criteria',
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

    @OneToMany(() => Match, (match) => match.round)
    matches!: Match[];

    @OneToMany(() => Genre, (genre) => genre.round)
    genres!: Genre[];

    @Column({ default: false })
    isQualifier!: boolean

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}
