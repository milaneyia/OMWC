import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role extends BaseEntity {

    static findUserRole() {
        return this.findOne(ROLE.User);
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;
}

export enum ROLE {
    User = 1,
    Mapper = 2,
    Captain = 3,
    Judge = 4,
    Staff = 5,
}
