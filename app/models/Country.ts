import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Brackets } from 'typeorm';
import { ROLE } from './Role';
import { User } from './User';
import { Submission } from './rounds/Submission';
import { Match } from './rounds/Match';
import { Ban } from './rounds/Ban';

@Entity()
export class Country extends BaseEntity {

    static getParticipatingTeams(): Promise<Country[]> {
        return this.createQueryBuilder('country')
            .innerJoinAndSelect('country.users', 'users')
            .where('country.wasConfirmed = 1')
            .andWhere(new Brackets(qb => {
                qb.where('users.roleId = :captain', { captain: ROLE.Captain })
                    .orWhere('users.roleId = :contestant', { contestant: ROLE.Contestant });
            }))
            .orderBy('country.name', 'ASC')
            .addOrderBy('users.roleId', 'DESC')
            .getMany();
    }

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

    @OneToMany(() => Ban, (ban) => ban.team)
    bans!: Ban[];

    @OneToMany(() => Submission, (submissions) => submissions.country)
    submissions!: Submission[];

}
