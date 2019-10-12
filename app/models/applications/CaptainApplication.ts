import {
    BaseEntity, Column, CreateDateColumn, Entity, ManyToOne,
    OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CaptainVote } from '../CaptainVote';
import { User } from '../User';

@Entity()
export class CaptainApplication extends BaseEntity {

    static findUserApplication(user: User) {
        return this.findOne({ where: { user } });
    }

    static findOneWithUser(captainApplicationId: number) {
        return this.findOne({
            relations: ['user'],
            where: { id: captainApplicationId },
        });
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 3000 })
    reason!: string;

    @ManyToOne((type) => User, (user) => user.captainApplication, { nullable: false })
    user!: User;

    @OneToMany((type) => CaptainVote, (captainVote) => captainVote.captainApplication)
    captainVotes!: CaptainVote[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
