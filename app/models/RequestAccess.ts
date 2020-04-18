import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class RequestAccess extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    mapLink!: string;

    @Column()
    wasAccepted!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
