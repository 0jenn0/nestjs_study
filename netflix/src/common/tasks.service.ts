import { Movie } from '@/movie/entity/movie.entity';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { readdir, unlink } from 'fs/promises';
import { join, parse } from 'path';
import { Repository } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
// import { DefaultLogger } from './logger/default.logger';

@Injectable()
export class TasksService {
  //   private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly schedulerRegistry: SchedulerRegistry,
    // private readonly logger: DefaultLogger,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
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

  @Cron('*/5 * * * * *', {
    // 가급적이면 cron job을 다이나믹 보다는 이렇게 선언적으로 사용하는게 좋다.
    name: 'printer',
  })
  printer() {
    // 중요도 내림차순으로 정리한것.
    this.logger.error('FATAL 레벨 로그', null, TasksService.name); // 치명적인 오류. 당장 고쳐야할 에러
    this.logger.error('ERROR 레벨 로그', null, TasksService.name); // 실제 오류가 났을 때
    this.logger.warn('WARN 레벨 로그', TasksService.name); // 이러나지 말아야할 오류가 나긴하는데 프로그램 실행에 문제는 안생기는 오류
    this.logger.log('LOG 레벨 로그', TasksService.name); // 정보성 로그를 작성할 때
    this.logger.debug('DEBUG 레벨 로그', TasksService.name); // 프로덕션이 아닌 개발환경에서 중요한 로그
    this.logger.verbose('VERBOSE 레벨 로그', TasksService.name); // 진짜 중요하지 않은 로그.
  }

  //   @Cron('*/5 * * * * *', {
  //     name: 'printer2',
  //   })
  stopper() {
    console.log('----stopper run----');

    const job = this.schedulerRegistry.getCronJob('printer');

    console.log('# Last Date');
    console.log(job.lastDate());

    // console.log('# Next Date');
    // console.log(job.nextDate());

    // console.log('# Next Dates');
    // console.log(job.nextDates(5));

    if (job.running) {
      job.stop();
    } else {
      job.start();
    }
  }
}
