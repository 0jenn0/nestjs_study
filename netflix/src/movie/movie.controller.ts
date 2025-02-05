import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ParseIntPipe,
  // UseGuards,

  // UploadedFile,
  // UploadedFiles,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ClassSerializerInterceptor } from '@nestjs/common';
// import { AuthGuard } from '@/auth/guard/auth.guard';
import { Public } from '@/auth/decorator/public.decorator';
import { RBAC } from '@/auth/decorator/rbac.decorator';
import { Role } from '@/user/entities/user.entity';
import { GetMovieDto } from './dto/get-movie.dto';
import { CacheInterceptor } from '@/common/interceptor/cache.interceptor';
import { TransactionInterceptor } from '@/common/interceptor/transaction.interceptor';
import {} from // FileInterceptor,
// FilesInterceptor,
// FileFieldsInterceptor,
'@nestjs/platform-express';
import { UserId } from '@/user/decorator/user-id.decorator';
import { QueryRunner } from '@/common/decorator/query-runner.decorator';
import { QueryRunner as QR } from 'typeorm';
// import { MovieFilePipe } from './pipe/movie-file.pipe';

@Controller('movie')
@UseInterceptors(ClassSerializerInterceptor) // 이거 추가해야 class-transformer 사용 가능
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  @Public()
  @UseInterceptors(CacheInterceptor)
  getMovies(@Query() dto: GetMovieDto) {
    return this.movieService.findAll(dto);
  }

  @Get(':id')
  @Public()
  getMovie(@Param('id', ParseIntPipe) id: number) {
    return this.movieService.findOne(id);
  }

  @Post()
  @RBAC(Role.admin)
  // @UseGuards(AuthGuard)
  @UseInterceptors(TransactionInterceptor)
  postMovie(
    @Body() body: CreateMovieDto,
    @UserId() userId: number,
    @QueryRunner() queryRunner: QR,
  ) {
    return this.movieService.create(body, userId, queryRunner);
  }

  @Patch(':id') // id는 절대 바뀔 일 없어야한다.
  @RBAC(Role.admin)
  patchMovie(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateMovieDto,
  ) {
    return this.movieService.update(id, body);
  }

  @Delete(':id')
  @RBAC(Role.admin)
  deleteMovie(@Param('id', ParseIntPipe) id: number) {
    return this.movieService.remove(id);
  }

  @Post(':id/like')
  createLikeMovie(
    @Param('id', ParseIntPipe) movieId: number,
    @UserId() userId: number,
  ) {
    return this.movieService.toggleMovieLIke(movieId, userId, true);
  }

  @Post(':id/dislike')
  createDislikeMovie(
    @Param('id', ParseIntPipe) movieId: number,
    @UserId() userId: number,
  ) {
    return this.movieService.toggleMovieLIke(movieId, userId, false);
  }
}
