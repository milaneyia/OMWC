import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Round } from './Round';
import { Ban } from './Ban';

@Entity()
export class Genre extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    downloadLink!: string;

    @Column()
    roundId!: number;

    @ManyToOne(() => Round, (round) => round.genres, { nullable: false })
    round!: Round;

    @OneToMany(() => Ban, (ban) => ban.genre)
    bans!: Ban[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
