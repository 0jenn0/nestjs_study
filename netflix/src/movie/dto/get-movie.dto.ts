import { CursorPaginationDto } from '@/common/dto/cursor-pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
// import { PagePaginationDto } from '@/common/dto/page-pagination.dto';
import { IsString, IsOptional } from 'class-validator';

// export class GetMovieDto extends PagePaginationDto {
export class GetMovieDto extends CursorPaginationDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '영화의 제목',
    example: '프로메테우스',
  })
  title?: string;
}
