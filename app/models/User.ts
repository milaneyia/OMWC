import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, OneToOne, JoinColumn, AfterInsert, AfterLoad } from 'typeorm';
import { CaptainApplication } from './applications/CaptainApplication';
import { Country } from './Country';
import { RequestAccess } from './RequestAccess';
import { Role, ROLE } from './Role';
import { MapperApplication } from './applications/MapperApplication';

@Entity()
export class User extends BaseEntity {

    static findOneOrFailWithTeam(userId: number): Promise<User> {
        return this.findOneOrFail({ where: { id: userId }, relations: ['team'] });
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    osuId!: number;

    @Column({ unique: true })
    username!: string;

    @Column()
    roleId!: number;

    @ManyToOne((type) => Role, { nullable: false })
    role!: Role;

    @ManyToOne((type) => Country, (country) => country.users, { nullable: false, eager: true })
    country!: Country;

    @Column({ nullable: true })
    requestAccessId?: number

    @OneToOne((type) => RequestAccess, (requestAccess) => requestAccess.user)
    @JoinColumn()
    requestAccess?: RequestAccess;

    @OneToOne((type) => MapperApplication)
    @JoinColumn()
    mapperApplication?: MapperApplication;

    @OneToOne((type) => CaptainApplication)
    @JoinColumn()
    captainApplication?: CaptainApplication;

    @Column({ nullable: true })
    captainVoteId?: number;

    @ManyToOne((type) => CaptainApplication, (captainApplication) => captainApplication.userVotes)
    captainVote?: CaptainApplication;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    isBasicUser!: boolean;
    isElevatedUser!: boolean;
    isRestricted!: boolean;
    isCaptain!: boolean;
    isJudge!: boolean;
    isStaff!: boolean;

    @AfterLoad()
    getVirtuals (): void {
        this.isBasicUser = this.roleId === ROLE.BasicUser;
        this.isElevatedUser = this.roleId === ROLE.ElevatedUser;
        this.isRestricted = this.roleId === ROLE.Restricted;
        this.isCaptain = this.roleId === ROLE.Captain;
        this.isJudge = this.roleId === ROLE.Judge;
        this.isStaff = this.roleId === ROLE.Staff;
    }

}
