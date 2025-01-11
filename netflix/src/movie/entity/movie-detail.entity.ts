import { Column, PrimaryGeneratedColumn, Entity, OneToOne } from 'typeorm';
import { Movie } from './movie.entity';

@Entity()
export class MovieDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  detail: string;

  @OneToOne(() => Movie)
  movie: Movie;
}
