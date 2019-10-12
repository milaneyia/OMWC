import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Country } from './Country';
import { User } from './User';

@Entity()
export class Team extends BaseEntity {

    static findOneWithUsers(countryId: number) {
        return this.findOne({ where: { country: countryId }, relations: ['users'] });
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ default: false })
    isCompeting!: boolean;

    @ManyToOne((type) => Country)
    country!: Country;

    @OneToMany((type) => User, (user) => user.team)
    users!: User[];
}
