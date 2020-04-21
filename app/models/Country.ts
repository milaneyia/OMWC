import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CaptainApplication } from './applications/CaptainApplication';
import { User } from './User';
import { Round } from './rounds/Round';
import { Submission } from './rounds/Submission';

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

    @OneToMany((type) => User, (user) => user.country)
    users!: User[];

    // @Column({ nullable: true })
    // captainId?: number | null;

    // @ManyToOne((type) => User)
    // captain!: User;

    @ManyToOne((type) => Round)
    eliminationRound!: Round;

    @OneToMany((type) => Submission, (submissions) => submissions.country)
    submissions!: Submission[];

    // Used for the leaderboard
    finalScore!: number;
    criteriaScores!: ICriteriaScore[];
}

export interface ICriteriaScore {
    criteria: string;
    score: number;
}