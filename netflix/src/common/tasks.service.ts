import { Movie } from '@/movie/entity/movie.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { readdir, unlink } from 'fs/promises';
import { join, parse } from 'path';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly schedulerRegistry: SchedulerRegistry,
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

  @Cron('* * * * * *', {
    // 가급적이면 cron job을 다이나믹 보다는 이렇게 선언적으로 사용하는게 좋다.
    name: 'printer',
  })
  printer() {
    console.log('print every seconds');
  }

  @Cron('*/5 * * * * *', {
    name: 'printer2',
  })
  stopper() {
    console.log('----stopper run----');

    const job = this.schedulerRegistry.getCronJob('printer');

    console.log('# Last Date');
    console.log(job.lastDate());

    console.log('# Next Date');
    console.log(job.nextDate());

    console.log('# Next Dates');
    console.log(job.nextDates(5));

    if (job.running) {
      job.stop();
    } else {
      job.start();
    }
  }
}
