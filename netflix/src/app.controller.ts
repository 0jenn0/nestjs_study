import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';

interface Movie {
  id: number;
  title: string;
}

@Controller('movie')
export class AppController {
  private movies: Movie[] = [
    { id: 1, title: '해리포터' },
    { id: 2, title: '반지의 제왕' },
  ];

  constructor(private readonly appService: AppService) {}

  @Get()
  getMovies() {
    return this.movies;
  }

  @Get(':id')
  getMovie(@Param('id') id: string) {
    const movie = this.movies.find((movie) => movie.id === +id);

    if (!movie) {
      // throw new Error(`Movie with ID ${id} not found`); // 이렇게하면 걍 500 에러 뜸
      throw new NotFoundException(`ID ${id} 영화가 없습니다.`); // 에러 메시지와 함께 404 에러 뜸
    }

    return movie;
  }

  @Post()
  postMovie(@Body('title') title: string) {
    const movie: Movie = {
      id: this.movies.length + 1,
      title,
    };

    this.movies.push(movie);

    return movie; // 왜 return movie 하는가? 클라이언트에서도 id를 알 수 있도록 하기 위해서
  }

  @Patch(':id') // id는 절대 바뀔 일 없어야한다.
  patchMovie(@Param('id') id: string, @Body('title') title: string) {
    const movie = this.movies.find((movie) => movie.id === +id);

    if (!movie) {
      throw new NotFoundException(`ID ${id} 영화가 없습니다.`);
    }

    Object.assign(movie, { title });

    return movie;
  }

  @Delete(':id')
  deleteMovie() {
    return 3;
  }
}
