import {
    BaseEntity, Column, CreateDateColumn, Entity, ManyToOne,
    OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CaptainApplication } from './applications/CaptainApplication';
import { Country } from './Country';
import { Role, ROLE } from './Role';
import { Team } from './Team';

@Entity()
export class User extends BaseEntity {

    static findOneOrFailWithTeam(userId: number) {
        return this.findOneOrFail({ where: { id: userId }, relations: ['team'] });
    }

    static isStaff(user: User) {
        return user.roleId === ROLE.Staff;
    }

    static isCaptain(user: User) {
        return user.team && user.team.captainId;
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

    @Column()
    roleId!: number;

    @ManyToOne((type) => Role, { nullable: false })
    role!: Role;

    @OneToMany((type) => CaptainApplication, (captainApplication) => captainApplication.user)
    captainApplication!: CaptainApplication[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
