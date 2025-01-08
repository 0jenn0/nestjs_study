import { Injectable, NotFoundException } from '@nestjs/common';

export interface Movie {
  id: number;
  title: string;
}

@Injectable()
export class AppService {
  private movies: Movie[] = [
    { id: 1, title: '해리포터' },
    { id: 2, title: '반지의 제왕' },
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

  createMovie(title: string): Movie {
    const movie: Movie = {
      id: this.movies.length + 1,
      title,
    };

    this.movies.push(movie);

    return movie; // 왜 return movie 하는가? 클라이언트에서도 id를 알 수 있도록 하기 위해서
  }

  updateMovie(id: number, title: string): Movie {
    const movie = this.movies.find((movie) => movie.id === id);

    if (!movie) {
      throw new NotFoundException(`ID ${id} 영화가 없습니다.`);
    }

    Object.assign(movie, { title });

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
