import { ArgumentsHost, ExceptionFilter, Catch } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError) // typeorm에서 query를 날릴 때 에러가 나면 이 에러가 발생한다.
export class QueryFailedErrorFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = 400; // QueryFailedError는 typeorm에서 오는거기때문에 status가 없다.
    // 클라이언트 딴에서 뭐가 잘못되었기 때문에 쿼리 에러가 나는거기 때문에 400을 준다.

    let message = '데이터베이스 에러 발생!';

    if (exception.message.includes('duplicate key')) {
      message = '중복 키 에러!';
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
