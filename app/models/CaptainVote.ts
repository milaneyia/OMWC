import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CaptainApplication } from './applications/CaptainApplication';
import { User } from './User';

@Entity()
export class CaptainVote extends BaseEntity {

    static findUserVotes(user: User) {
        return this.find({ where: { user }, relations: ['captainApplication'] });
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: number;

    @ManyToOne((type) => User, { nullable: false })
    user!: User;

    @Column()
    captainApplicationId!: number;

    @ManyToOne(
        (type) => CaptainApplication,
        (captainApplication) => captainApplication.captainVotes,
        { nullable: false },
    )
    captainApplication!: CaptainApplication;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
