import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { User } from '../User';

@Entity()
export class CaptainApplication extends BaseEntity {

    static findUserApplication(userId: number): Promise<CaptainApplication | undefined> {
        return this
            .createQueryBuilder('captainApplication')
            .innerJoinAndSelect('captainApplication.user', 'user')
            .where('user.id = :userId', { userId })
            .getOne();
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

    @OneToOne(() => User, user => user.captainApplication)
    user!: User;

    @OneToMany(() => User, user => user.captainVote)
    userVotes!: User[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
