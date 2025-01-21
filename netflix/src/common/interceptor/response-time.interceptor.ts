import {
  Injectable,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';

import { Observable, tap } from 'rxjs';

@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const reqTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const respTime = Date.now();
        const diff = respTime - reqTime;

        console.log(`[${req.method} ${req.url}] Response time: ${diff}ms`);
      }),
    );
  }
}
