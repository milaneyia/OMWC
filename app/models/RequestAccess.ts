import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class RequestAccess extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    mapLink!: string;

    @Column()
    wasAccepted!: boolean;

    @OneToOne((type) => User, (user) => user.requestAccess, { nullable: false })
    user!: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
