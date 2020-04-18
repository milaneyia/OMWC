import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { User } from '../User';

@Entity()
export class MapperApplication extends BaseEntity {

    static findUserApplication(userId: number) {
        return this.findOne({ where: { userId } });
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: number;

    @OneToOne(type => User, user => user.mapperApplication)
    user!: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
