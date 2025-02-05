import { User } from '@/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Movie } from './movie.entity';

@Entity()
export class MovieUserLike {
  @PrimaryColumn({
    name: 'movieId',
    type: 'int8',
  }) // relation으로 할 때는 자동으로 type과 column이름 유추가 안되기때문에 직접 넣어줘야한다.
  @ManyToOne(() => Movie, movie => movie.likedUsers)
  movie: Movie;

  @PrimaryColumn({
    name: 'userId',
    type: 'int8',
  })
  @ManyToOne(() => User, user => user.likedMovies)
  user: User;

  @Column()
  isLike: boolean;
}
