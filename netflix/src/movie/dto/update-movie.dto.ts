import { Equals, IsDefined, IsEmpty, IsIn, IsNotEmpty, IsNotIn, IsOptional, NotEquals } from 'class-validator';

export class UpdateMovieDto {
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsNotEmpty()
  @IsOptional()
  genre?: string;

  @IsDefined() // null 이나 undefined가 아닐 때 통과
  @IsOptional()
  @Equals('test') // 'test' 일 때만 통과
  @NotEquals('test') // 'test'가 아닐 때만 통과
  @IsEmpty() // null || undefined || '' 일 때 통과
  @IsNotEmpty() // null || undefined || '' 가 아닐 때 통과
  // Array
  @IsIn(['액션', '판타지']) // 배열 안에 있는 값일 때 통과
  @IsNotIn(['액션', '판타지']) // 배열 안에 있는 값이 아닐 때 통과
  test: string;
}
