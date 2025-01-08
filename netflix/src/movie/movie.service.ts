import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

export interface Movie {
  id: number;
  title: string;
  genre: string;
}
@Injectable()
export class MovieService {
  private movies: Movie[] = [
    { id: 1, title: '해리포터', genre: '판타지' },
    { id: 2, title: '반지의 제왕', genre: '판타지' },
  ];

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
    const movie: Movie = {
      id: this.movies.length + 1,
      ...createMovieDto,
    };

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
