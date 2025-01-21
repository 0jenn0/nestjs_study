import { Injectable } from '@nestjs/common';

import { CallHandler, InternalServerErrorException } from '@nestjs/common';

import { delay, Observable, tap } from 'rxjs';

import { ExecutionContext, NestInterceptor } from '@nestjs/common';

@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const reqTime = Date.now();

    return next.handle().pipe(
      delay(1_000),
      tap(() => {
        const respTime = Date.now();
        const diff = respTime - reqTime;

        if (diff > 1_000) {
          console.log(
            `!!!TIMEOUT!!! [${req.method} ${req.url}] Response time: ${diff}ms`,
          );

          throw new InternalServerErrorException(
            '시간이 너무 오래 걸렸습니다!',
          );
        } else {
          console.log(`[${req.method} ${req.url}] Response time: ${diff}ms`);
        }
      }),
    );
  }
}
