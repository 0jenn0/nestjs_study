import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class MovieTitleValidationPipe implements PipeTransform<string, string> {
  transform(value: string) {
    if (!value) return value;

    if (value.length <= 2) {
      throw new BadRequestException('제목은 3글자 이상이어야 합니다.');
    }

    return value;
  }
}
