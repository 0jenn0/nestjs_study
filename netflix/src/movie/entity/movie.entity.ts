import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  VersionColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export class BaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  version: number;
}

@Entity()
export class Movie extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  genre: string;

  @Column(() => BaseEntity)
  base: BaseEntity;
}
