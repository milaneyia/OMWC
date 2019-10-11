import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
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

    @ManyToOne((type) => User, { nullable: false })
    user!: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
