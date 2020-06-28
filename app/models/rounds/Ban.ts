import { BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, Column } from 'typeorm';
import { Country } from '../Country';
import { Genre } from './Genre';

@Entity()
export class Ban extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    place!: number;

    @Column()
    teamId!: number;

    @ManyToOne(() => Country, (country) => country.bans, { nullable: false })
    team!: Country;

    @Column()
    genreId!: number;

    @ManyToOne(() => Genre, (genre) => genre.bans, { nullable: false })
    genre!: Genre;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
