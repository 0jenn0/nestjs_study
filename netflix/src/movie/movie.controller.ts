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
  Req,
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
  postMovie(@Body() body: CreateMovieDto, @Req() req) {
    return this.movieService.create(body, req.queryRunner);
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
}
