import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entity/movie.entity';

@Injectable()
export class MovieService {
  private movies: Movie[] = [];

  constructor() {
    const movie1 = new Movie();
    movie1.id = 1;
    movie1.title = '해리포터';
    movie1.genre = '판타지~';

    const movie2 = new Movie();
    movie2.id = 2;
    movie2.title = '반지의 제왕';
    movie2.genre = '판타지';

    this.movies.push(movie1, movie2);
  }

  getManyMovies(title?: string): Movie[] {
    if (!title) return this.movies;

    return this.movies.filter((movie) => movie.title.startsWith(title));
  }

  getMovieById(id: number): Movie {
    const movie = this.movies.find((movie) => movie.id === id);

    if (!movie) {
      throw new NotFoundException(`ID ${id} 영화가 없습니다.`); // 에러 메시지와 함께 404 에러 뜸
    }

    return movie;
  }

  createMovie(createMovieDto: CreateMovieDto): Movie {
    const movie = new Movie();
    Object.assign(movie, {
      id: this.movies.length + 1,
      ...createMovieDto,
    });

    this.movies.push(movie);

    return movie; // 왜 return movie 하는가? 클라이언트에서도 id를 알 수 있도록 하기 위해서
  }

  updateMovie(id: number, updateMovieDto: UpdateMovieDto): Movie {
    const movie = this.movies.find((movie) => movie.id === id);

    if (!movie) {
      throw new NotFoundException(`ID ${id} 영화가 없습니다.`);
    }

    Object.assign(movie, updateMovieDto);

    return movie;
  }

  deleteMovie(id: number): number {
    const movieIndex = this.movies.findIndex((movie) => movie.id === id);

    if (movieIndex === -1) {
      throw new NotFoundException(`ID ${id} 영화가 없습니다.`);
    }
    this.movies.splice(movieIndex, 1);

    return id;
  }
}
