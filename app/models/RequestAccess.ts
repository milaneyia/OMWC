import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { User } from './User';

export enum STATUS {
    Pending = 'Pending',
    Accepted = 'Accepted',
    Rejected = 'Rejected',
}

@Entity()
export class RequestAccess extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    mapLink!: string;

    @Column({ type: 'enum', enum: STATUS, default: STATUS.Pending })
    status!: STATUS;

    @OneToOne(() => User, (user) => user.requestAccess, { nullable: false })
    user!: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
