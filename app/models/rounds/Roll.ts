import { BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, Column } from 'typeorm';
import { Country } from '../Country';
import { Match } from './Match';

@Entity()
export class Roll extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    value!: number;

    @Column()
    teamId!: number;

    @ManyToOne(() => Country, (country) => country.rolls, { nullable: false })
    team!: Country;

    @Column()
    matchId!: number;

    @ManyToOne(() => Match, (match) => match.rolls, { nullable: false })
    match!: Match;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}
