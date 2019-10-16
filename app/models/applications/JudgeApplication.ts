import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../User';

@Entity()
export class JudgeApplication extends BaseEntity {

    static findUserApplication(userId: number) {
        return this.findOne({ where: { userId } });
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 3000 })
    reason!: string;

    @Column()
    userId!: number;

    @ManyToOne((type) => User, { nullable: false })
    user!: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
