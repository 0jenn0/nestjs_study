import { PagePaginationDto } from '@/common/dto/page-pagination.dto';
import { IsString, IsOptional } from 'class-validator';

export class GetMovieDto extends PagePaginationDto {
  @IsOptional()
  @IsString()
  title?: string;
}
