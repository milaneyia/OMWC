import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { User } from '../User';

@Entity()
export class MapperApplication extends BaseEntity {

    static findUserApplication(userId: number): Promise<MapperApplication | undefined> {
        return this
            .createQueryBuilder('mapperApplication')
            .innerJoinAndSelect('mapperApplication.user', 'user')
            .where('user.id = :userId', { userId })
            .getOne();
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(type => User, user => user.mapperApplication)
    user!: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
