import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Round } from './rounds/Round';
import { Submission } from './rounds/Submission';
import { Match } from './rounds/Match';

@Entity()
export class Country extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @Column({ unique: true })
    code!: string;

    @Column({ default: false })
    wasConfirmed!: boolean;

    @OneToMany(() => User, (user) => user.country)
    users!: User[];

    @OneToMany(() => Match, (match) => match.teamA)
    matchesA!: Match[];

    @OneToMany(() => Match, (match) => match.teamB)
    matchesB!: Match[];

    @ManyToOne(() => Round)
    eliminationRound!: Round;

    @OneToMany(() => Submission, (submissions) => submissions.country)
    submissions!: Submission[];

    // Used for the leaderboard
    finalScore!: number;
    criteriaScores!: CriteriaScore[];
}

export interface CriteriaScore {
    criteria: string;
    score: number;
}
