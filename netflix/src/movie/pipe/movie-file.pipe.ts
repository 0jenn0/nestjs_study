import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { v4 } from 'uuid';
import { rename } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class MovieFilePipe implements PipeTransform {
  constructor(
    private readonly options: {
      maxSize: number;
      mimetype: string;
    },
  ) {}

  async transform(value: Express.Multer.File) {
    if (!value) {
      new BadRequestException('movie 필드는 필수입니다!');
    }

    const byteSize = this.options.maxSize * 1_000_000; // 메가 바이트

    if (value.size > byteSize) {
      throw new BadRequestException(
        `${this.options.maxSize}MB 이하의 파일만 업로드 가능합니다!`,
      );
    }

    if (value.mimetype !== this.options.mimetype) {
      throw new BadRequestException(
        `${this.options.mimetype} 파일만 업로드 가능합니다!`,
      );
    }

    const uuid = v4();

    const split = value.originalname.split('.');
    let extension = 'mp4';

    if (split.length > 1) {
      extension = split[split.length - 1];
    }

    const filename = `${uuid}_${Date.now()}.${extension}`;
    const newPath = join(value.destination, filename);

    await rename(value.path, newPath);

    return {
      ...value,
      filename,
      path: newPath,
    };
  }
}
