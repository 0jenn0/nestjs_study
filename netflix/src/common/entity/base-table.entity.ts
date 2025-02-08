import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export class BaseTable {
  @CreateDateColumn()
  @Exclude() // 이거해도 Swagger에는 나온다.
  @ApiHideProperty() // 얘도 추가해야 Swagger에 안나온다.
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  @ApiHideProperty()
  updatedAt: Date;

  @VersionColumn()
  @Exclude()
  @ApiHideProperty()
  version: number;
}
