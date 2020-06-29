import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, Brackets } from 'typeorm';
import { Submission } from './Submission';
import { Round } from './Round';
import { EliminationJudging } from '../judging/EliminationJudging';
import { Country } from '../Country';

@Entity()
export class Match extends BaseEntity {

    static findByRoundWithSubmissions(roundId: number): Promise<Match[]> {
        return Match.find({
            where: { roundId },
            relations: [
                'round',
                'round.genres',
                'submissions',
                'teamA',
                'teamA.bans',
                'teamA.bans.genre',
                'teamB',
                'teamB.bans',
                'teamB.bans.genre',
            ],
        });
    }

    static findRelatedCountryMatch(round: Round, countryId: number): Promise<Match | undefined> {
        if (round.isQualifier) {
            return Match.findOne({ roundId: round.id });
        } else {
            return Match
                .createQueryBuilder('match')
                .where('match.roundId = :roundId', { roundId: round.id })
                .andWhere(new Brackets(qb => {
                    qb.where('match.teamAId = :teamAId', { teamAId: countryId })
                        .orWhere('match.teamBId = :teamBId', { teamBId: countryId });
                }))
                .getOne();
        }
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true, length: 3000 })
    information?: string;

    @Column()
    roundId!: number;

    @Column({ nullable: true })
    teamAId?: number;

    @Column({ nullable: true })
    teamBId?: number;

    @ManyToOne(() => Round, { nullable: false })
    round!: Round;

    @OneToMany(() => Submission, (submission) => submission.match)
    submissions!: Submission[];

    @OneToMany(() => EliminationJudging, (eliminationJudging) => eliminationJudging.match)
    eliminationJudging!: EliminationJudging[];

    @ManyToOne(() => Country, (country) => country.matchesA)
    teamA?: Country;

    @ManyToOne(() => Country, (country) => country.matchesB)
    teamB?: Country;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
