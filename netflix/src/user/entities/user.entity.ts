import { Movie } from '@/movie/entity/movie.entity';
import { Exclude } from 'class-transformer';
import {
  Column,
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

export enum Role {
  admin,
  paidUser,
  user,
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Movie, movie => movie.creator)
  createdMovies: Movie[];

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  @Exclude({
    // toClassOnly: true, // 요청을 받을 때 제외
    toPlainOnly: true, // 응답을 보낼 때 제외
  })
  password: string;

  @Column({
    enum: Role,
    default: Role.user,
  })
  role: Role;
}
