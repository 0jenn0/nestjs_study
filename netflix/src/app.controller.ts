import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';

interface Movie {
  id: string;
  title: string;
}

@Controller('movie')
export class AppController {
  private movies: Movie[] = [
    { id: '1', title: '해리포터' },
    { id: '2', title: '반지의 제왕' },
    { id: '3', title: '어벤져스' },
  ];

  constructor(private readonly appService: AppService) {}

  @Get()
  getMovies() {
    return this.movies;
  }

  @Get(':id')
  getMovie() {
    return {
      id: '1',
      name: '해리포터',
      character: ['해리포터', '에미왓슨'],
    };
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
