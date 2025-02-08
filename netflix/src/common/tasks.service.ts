import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor() {}

  @Cron('* * * * * *') // 초 분 시 일 월 요일
  logEverySecond() {
    console.log('1초 마다 실행');
  }
}
