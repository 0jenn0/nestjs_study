import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { Movie } from './movie.entity';

@Entity()
export class MovieDetail {
  @PrimaryColumn()
  id: number;

  @Column()
  detail: string;

  @OneToOne(() => Movie)
  movie: Movie;
}
