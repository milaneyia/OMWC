import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { User } from '../User';

@Entity()
export class CaptainApplication extends BaseEntity {

    static findUserApplication(userId: number): Promise<CaptainApplication | undefined> {
        return this.findOne({ where: { userId } });
    }

    static findOneOrFailWithUser(captainApplicationId: number): Promise<CaptainApplication> {
        return this.findOneOrFail({
            relations: ['user'],
            where: { id: captainApplicationId },
        });
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 3000 })
    reason!: string;

    @OneToOne(type => User, user => user.captainApplication)
    user!: User;

    @OneToMany((type) => User, user => user.captainVote)
    userVotes!: User[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
