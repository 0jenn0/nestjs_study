import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('movie')
  getMovies() {
    return [
      {
        id: '1',
        name: '해리포터',
        character: ['해리포터', '에미왓슨'],
      },
      {
        id: '2',
        name: '반지의 제왕',
        character: ['호비트', '라우렌'],
      },
    ];
  }

  @Get('movie/:id')
  getMovie() {
    return {
      id: '1',
      name: '해리포터',
      character: ['해리포터', '에미왓슨'],
    };
  }

  @Post('movie')
  postMovie() {
    return {
      id: '3',
      name: '어벤져스',
      character: ['토니스타크', '스티브로저스'],
    };
  }

  @Patch('movie/:id')
  patchMovie() {
    return {
      id: '3',
      name: '어벤져스',
      character: ['토니스타크', '블랙위도우'],
    };
  }

  @Delete('movie/:id')
  deleteMovie() {
    return 3;
  }
}
