import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Submission } from './Submission';
import { Round } from './Round';
import { EliminationJudging } from '../judging/EliminationJudging';
import { Country } from '../Country';

@Entity()
export class Match extends BaseEntity {

    static findByRoundWithSubmissions(roundId: number): Promise<Match[]> {
        return Match.find({
            where: { roundId },
            relations: ['submissions'],
        });
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

    @ManyToOne((type) => Round, { nullable: false })
    round!: Round;

    @OneToMany((type) => Submission, (submission) => submission.match)
    submissions!: Submission[];

    @OneToMany((type) => EliminationJudging, (eliminationJudging) => eliminationJudging.match)
    eliminationJudging!: EliminationJudging[];

    @ManyToOne((type) => Country, (country) => country.matchesA)
    teamA?: Country;

    @ManyToOne((type) => Country, (country) => country.matchesB)
    teamB?: Country;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
