import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../User';

@Entity()
export class JudgeApplication extends BaseEntity {

    static findUserApplication(user: User) {
        return this.findOne({ where: { user } });
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
