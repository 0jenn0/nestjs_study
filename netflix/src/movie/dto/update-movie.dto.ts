import { Equals, IsArray, IsBoolean, IsDate, IsDateString, IsDefined, IsEmpty, IsEnum, IsIn, IsInt, IsNotEmpty, IsNotIn, IsNumber, IsObject, IsOptional, IsString, NotEquals } from 'class-validator';


enum MovieGenre {
  ACTION = '액션',
  FANTASY = '판타지',
}
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
  // Type
  @IsBoolean() // boolean 일 때 통과
  @IsString() // string 일 때 통과
  @IsNumber() // number 일 때 통과
  @IsInt() // integer 일 때 통과
  @IsArray() // 배열 일 때 통과
  @IsEnum(MovieGenre) // enum 일 때 통과
  @IsDate() // Date 객체 일 때 통과
  @IsDateString() // Date 문자열 일 때 통과. 예) "2025-01-01T12:00"
  @IsObject() // 객체 일 때 통과
  test: string;
}
