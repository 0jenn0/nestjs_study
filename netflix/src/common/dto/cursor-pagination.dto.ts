import { IsOptional, IsInt, IsArray, IsString } from 'class-validator';

export class CursorPaginationDto {
  @IsInt()
  @IsOptional()
  // id_52, likeCount_20
  cursor?: string;

  @IsArray()
  @IsString({
    each: true,
  })
  @IsOptional()
  // id_ASC, id_DESC
  // [id_ASC, likeCount_DESC]
  order: string[] = [];

  @IsInt()
  @IsOptional()
  take: number = 5;
}
