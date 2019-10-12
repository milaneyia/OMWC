import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Schedule extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('date')
    applicationsStartedAt!: Date;

    @Column('date', { nullable: true })
    captainApplicationsEndedAt?: Date;

    @Column('date', { nullable: true })
    captainVotingStartedAt?: Date;

    @Column('date', { nullable: true })
    captainVotingEndedAt?: Date;

    @Column('date', { nullable: true })
    mappersChoiceStartedAt?: Date;

    @Column('date', { nullable: true })
    mappersChoiceEndedAt?: Date;

    @Column('date', { nullable: true })
    mapperApplicationsEndedAt?: Date;

    @Column('date', { nullable: true })
    judgeApplicationsEndedAt?: Date;

    @Column('date', { nullable: true })
    constestStartedAt?: Date;

    @Column('date', { nullable: true })
    constestEndedAt?: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
