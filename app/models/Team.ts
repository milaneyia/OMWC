import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Country } from './Country';

@Entity()
export class Team extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ default: false })
    isCompeting!: boolean;

    @ManyToOne((type) => Country)
    country!: Country;
}
