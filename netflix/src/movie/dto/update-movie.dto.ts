import { Equals, IsAlphanumeric, IsArray, IsBoolean, IsCreditCard, IsDate, IsDateString, IsDefined, IsDivisibleBy, IsEmpty, IsEnum, IsHexColor, IsIn, IsInt, IsNegative, IsNotEmpty, IsNotIn, IsNumber, IsObjecMinLength, t, IsOptional, IsPositive, IsString, Max, MaxLength, Min, NotContains, NotEquals, MinLength, IsUUID, IsObject, IsLatLong } from 'class-validator';


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
  // 숫자
  @IsDivisibleBy(10) // 10의 배수일 때 통과
  @IsPositive() // 양수일 때 통과
  @IsNegative() // 음수일 때 통과
  @Min(100) // 최소값 100 이상일 때 통과
  @Max(1000) // 최대값 1000 이하일 때 통과
  // 문자
  @NotContains('test') // 'test'가 포함되지 않을 때 통과
  @IsAlphanumeric() // 알파벳과 숫자만 포함될 때 통과
  @IsCreditCard() // 신용카드 번호일 때 통과
  @IsHexColor() // 16진수 색상일 때 통과
  @MaxLength(10) // 최대 10자 이하일 때 통과
  @MinLength(10) // 최소 10자 이상일 때 통과
  @IsUUID() // UUID 일 때 통과
  @IsLatLong() // 위도, 경도 일 때 통과
  test: string;
}
