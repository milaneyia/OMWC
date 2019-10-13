import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Round extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    information!: string;

    @Column('date')
    submissionsStartedAt!: Date;

    @Column('date')
    submissionsEndedAt!: Date;

    @Column('date')
    judgingStartedAt!: Date;

    @Column('date')
    judgingEndedAt!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
