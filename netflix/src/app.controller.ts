import {
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
  postMovie() {
    return {
      id: '3',
      name: '어벤져스',
      character: ['토니스타크', '스티브로저스'],
    };
  }

  @Patch(':id')
  patchMovie() {
    return {
      id: '3',
      name: '어벤져스',
      character: ['토니스타크', '블랙위도우'],
    };
  }

  @Delete(':id')
  deleteMovie() {
    return 3;
  }
}
