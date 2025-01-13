import { Column, BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  admin,
  paidUser,
  user,
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    enum: Role,
    default: Role.user,
  })
  role: Role;
}
