import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PagePaginationDto } from './dto/page-pagination.dto';
import { SelectQueryBuilder } from 'typeorm';
import { CursorPaginationDto } from './dto/cursor-pagination.dto';

@Injectable()
export class CommonService {
  constructor(private readonly configService: ConfigService) {}

  applyPagePaginationParamsToQb<T>(
    qb: SelectQueryBuilder<T>,
    dto: PagePaginationDto,
  ) {
    const { page, take } = dto;

    const skip = (page - 1) * take;

    qb.take(take);
    qb.skip(skip);
  }

  applyCursorPaginationParamsToQb<T>(
    qb: SelectQueryBuilder<T>,
    dto: CursorPaginationDto,
  ) {
    const { id, order, take } = dto;

    if (id) {
      const direction = order === 'ASC' ? '>' : '<';

      qb.where(`${qb.alias}.id ${direction} :id`, { id });
    }

    qb.orderBy(`${qb.alias}.id`, order); // qb.alias는 테이블 이름이다.

    qb.take(take);
  }
}
