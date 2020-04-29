import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, OneToOne, JoinColumn, AfterLoad } from 'typeorm';
import { CaptainApplication } from './applications/CaptainApplication';
import { Country } from './Country';
import { RequestAccess } from './RequestAccess';
import { Role, ROLE } from './Role';
import { MapperApplication } from './applications/MapperApplication';

@Entity()
export class User extends BaseEntity {

    static findOneOrFailWithRelevantInfo(osuId: number): Promise<User> {
        return User.findOneOrFail({
            where: { osuId },
            relations: [
                'country',
                'requestAccess',
                'mapperApplication',
                'captainApplication',
                'captainVote',
            ],
        });
    }

    static findOneWithRelevantInfo(osuId: number): Promise<User | undefined> {
        return User.findOne({
            where: { osuId },
            relations: [
                'country',
                'requestAccess',
                'mapperApplication',
                'captainApplication',
                'captainVote',
            ],
        });
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    osuId!: number;

    @Column({ unique: true })
    username!: string;

    @Column()
    roleId!: number;

    @ManyToOne(() => Role, { nullable: false })
    role!: Role;

    @ManyToOne(() => Country, (country) => country.users, { nullable: false, eager: true })
    country!: Country;

    @Column({ nullable: true })
    requestAccessId?: number

    @OneToOne(() => RequestAccess, (requestAccess) => requestAccess.user)
    @JoinColumn()
    requestAccess?: RequestAccess;

    @OneToOne(() => MapperApplication)
    @JoinColumn()
    mapperApplication?: MapperApplication;

    @OneToOne(() => CaptainApplication)
    @JoinColumn()
    captainApplication?: CaptainApplication;

    @Column({ nullable: true })
    captainVoteId?: number;

    @ManyToOne(() => CaptainApplication, (captainApplication) => captainApplication.userVotes)
    captainVote?: CaptainApplication;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    isBasicUser!: boolean;
    isElevatedUser!: boolean;
    isRestricted!: boolean;
    isContestant!: boolean;
    isCaptain!: boolean;
    isJudge!: boolean;
    isStaff!: boolean;

    @AfterLoad()
    getVirtuals (): void {
        this.isBasicUser = this.roleId === ROLE.BasicUser;
        this.isElevatedUser = this.roleId === ROLE.ElevatedUser;
        this.isRestricted = this.roleId === ROLE.Restricted;
        this.isContestant = this.roleId === ROLE.Contestant;
        this.isCaptain = this.roleId === ROLE.Captain;
        this.isJudge = this.roleId === ROLE.Judge;
        this.isStaff = this.roleId === ROLE.Staff;
    }

}
