import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CaptainApplication } from './applications/CaptainApplication';
import { User } from './User';

@Entity()
export class CaptainVote extends BaseEntity {

    static findUserVotes(user: User) {
        return this.find({ where: { user }, relations: ['captainApplication'] });
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne((type) => User, { nullable: false })
    user!: User;

    @ManyToOne((type) => CaptainApplication, { nullable: false })
    captainApplication!: CaptainApplication;
}
