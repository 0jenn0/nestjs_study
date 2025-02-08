import { Movie } from '@/movie/entity/movie.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { readdir, unlink } from 'fs/promises';
import { join, parse } from 'path';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  logEverySecond() {
    console.log('1초 마다 실행');
  }

  //   @Cron('* * * * * *') // 초 분 시 일 월 요일
  async eraseOrphanFiles() {
    const files = await readdir(join(process.cwd(), 'public', 'temp'));

    const deleteFilesTargets = files.filter(file => {
      const filename = parse(file).name; // 끝에 확장자를 제외한 이름이 나온다.

      const split = filename.split('_');

      if (split.length !== 2) return true;

      try {
        const date = +new Date(parseInt(split[split.length - 1]));
        const aDayInMillisecond = 24 * 60 * 60 * 1_000;

        const now = +new Date();

        return now - date > aDayInMillisecond;
      } catch {
        return true;
      }
    });

    await Promise.all(
      deleteFilesTargets.map(async filename => {
        unlink(join(process.cwd(), 'public', 'temp', filename));
      }),
    );
  }

  @Cron('0 * * * * *') // 초 분 시 일 월 요일
  async calculateMovieLikeCounts() {
    await this.movieRepository.query(
      `
        UPDATE movie m
        SET "likeCount" = (
            SELECT COUNT(*) FROM movie_user_like mul
            WHERE mul."movieId" = m.id AND mul."isLike" = true
        )
        `,
    );

    await this.movieRepository.query(
      `
         UPDATE movie m
        SET "dislikeCount" = (
            SELECT COUNT(*) FROM movie_user_like mul
            WHERE mul."movieId" = m.id AND mul."isLike" = false
        )`,
    );
  }
}
