import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Schedule extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('datetime')
    applicationsStartedAt!: Date;

    @Column('datetime')
    captainApplicationsEndedAt!: Date;

    @Column('datetime')
    captainVotingStartedAt!: Date;

    @Column('datetime')
    captainVotingEndedAt!: Date;

    @Column('datetime')
    mapperApplicationsEndedAt!: Date;

    @Column('datetime')
    judgeApplicationsEndedAt!: Date;

    @Column('datetime')
    constestStartedAt!: Date;

    @Column('datetime')
    constestEndedAt!: Date;
}
