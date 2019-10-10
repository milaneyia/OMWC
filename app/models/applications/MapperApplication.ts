import { BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../User';

@Entity()
export class MapperApplication extends BaseEntity {

    static findUserApplication(user: User) {
        return this.findOne({ where: { user } });
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne((type) => User, { nullable: false })
    user!: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
