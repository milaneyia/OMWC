import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Schedule extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('date')
    applicationsStartedAt!: Date;

    @Column('date')
    captainApplicationsEndedAt!: Date;

    @Column('date')
    captainVotingStartedAt!: Date;

    @Column('date')
    captainVotingEndedAt!: Date;

    @Column('date')
    mappersChoiceStartedAt!: Date;

    @Column('date')
    mappersChoiceEndedAt!: Date;

    @Column('date')
    mapperApplicationsEndedAt!: Date;

    @Column('date')
    judgeApplicationsEndedAt!: Date;

    @Column('date')
    constestStartedAt!: Date;

    @Column('date')
    constestEndedAt!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
