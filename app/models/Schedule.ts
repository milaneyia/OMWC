import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Schedule extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('date')
    applicationsStartedAt!: Date;

    @Column('date')
    applicationsEndedAt!: Date;

    @Column('date')
    captainVotingStartedAt!: Date;

    @Column('date')
    captainVotingEndedAt!: Date;

    @Column('date')
    mappersChoiceStartedAt!: Date;

    @Column('date')
    mappersChoiceEndedAt!: Date;

    @Column('date')
    contestStartedAt!: Date;

    @Column('date')
    contestEndedAt!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
