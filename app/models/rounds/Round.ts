import { BaseEntity, Column, CreateDateColumn, Entity, LessThanOrEqual,
    MoreThanOrEqual, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Round extends BaseEntity {

    static findCurrentRound() {
        const today = new Date();

        return this.findOne({
            where: {
                submissionsEndedAt: MoreThanOrEqual(today),
                submissionsStartedAt: LessThanOrEqual(today),
            },
        });
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column({ nullable: true, length: 3000 })
    information?: string;

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
