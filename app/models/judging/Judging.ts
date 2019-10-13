import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Round } from '../rounds/Round';
import { Team } from '../Team';
import { User } from '../User';
import { JudgingCriteria } from './JudgingCriteria';

@Entity()
export class Judging extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('double')
    score!: number;

    @Column()
    comment!: string;

    @ManyToOne((type) => JudgingCriteria, { nullable: false })
    judgingCriteria!: JudgingCriteria;

    @ManyToOne((type) => Team, { nullable: false })
    team!: Team;

    @ManyToOne((type) => User, { nullable: false })
    judge!: User;

    @ManyToOne((type) => Round, { nullable: false })
    round!: Round;
}
