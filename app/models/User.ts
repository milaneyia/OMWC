import {
    BaseEntity, Column, CreateDateColumn, Entity, JoinTable,
    ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CaptainApplication } from './applications/CaptainApplication';
import { Country } from './Country';
import { Role, ROLE } from './Role';
import { Team } from './Team';

@Entity()
export class User extends BaseEntity {

    static findOneWithRoles(userId: number) {
        return this.findOne({ where: { id: userId }, relations: ['roles'] });
    }

    static isStaff(user: User) {
        return user.roles.find((r) => r.id === ROLE.Staff);
    }

    static isCaptain(user: User) {
        return user.roles.find((r) => r.id === ROLE.Captain);
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    osuId!: number;

    @Column({ unique: true })
    username!: string;

    @ManyToOne((type) => Country, (country) => country.users, { nullable: false, eager: true })
    country!: Country;

    @Column({ nullable: true })
    teamId?: number | null;

    @ManyToOne((type) => Team, (team) => team.users)
    team?: Team | null;

    @ManyToMany((type) => Role)
    @JoinTable()
    roles!: Role[];

    @OneToMany((type) => CaptainApplication, (captainApplication) => captainApplication.user)
    captainApplication!: CaptainApplication[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
