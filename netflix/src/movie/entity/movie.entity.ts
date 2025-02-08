import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { BaseTable } from '../../common/entity/base-table.entity';
import { MovieDetail } from './movie-detail.entity';
import { Director } from '@/director/entity/director.entity';
import { Genre } from '@/genre/entities/genre.entity';
import { Transform } from 'class-transformer';
import { User } from '@/user/entities/user.entity';
import { MovieUserLike } from './movie-user-like.entity';

// ManyToOne Director -> 감독은 여러개의 영화를 만들 수 있음
// OneToOne MovieDetail -> 영화는 하나의 영화 상세 정보를 가짐
// ManyToMany Genre -> 영화는 여러개의 장르를 가질 수 있음

@Entity()
export class Movie extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.createdMovies, {
    cascade: true,
    nullable: true,
  })
  creator: User;

  @Column({
    unique: true,
  })
  title: string;

  @ManyToMany(() => Genre, genre => genre.movies)
  @JoinTable()
  genres: Genre[];

  @Column({
    default: 0,
  })
  likeCount: number;

  @Column({
    default: 0,
  })
  dislikeCount: number;

  @OneToOne(() => MovieDetail, movieDetail => movieDetail.id, {
    cascade: true,
    nullable: false,
  })
  @JoinColumn()
  detail: MovieDetail;

  @Column()
  @Transform(({ value }) => `http://localhost:3000/${value}`)
  movieFilePath: string;

  @ManyToOne(() => Director, director => director.id, {
    cascade: true,
    nullable: false,
  })
  director: Director;

  @OneToMany(() => MovieUserLike, movieUserLike => movieUserLike.movie)
  likedUsers: MovieUserLike[];
}
