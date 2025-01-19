import { CursorPaginationDto } from '@/common/dto/cursor-pagination.dto';
// import { PagePaginationDto } from '@/common/dto/page-pagination.dto';
import { IsString, IsOptional } from 'class-validator';

// export class GetMovieDto extends PagePaginationDto {
export class GetMovieDto extends CursorPaginationDto {
  @IsOptional()
  @IsString()
  title?: string;
}
