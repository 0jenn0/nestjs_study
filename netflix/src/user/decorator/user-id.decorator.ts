import {
  createParamDecorator,
  ExecutionContext,
  //   UnauthorizedException,
} from '@nestjs/common';

export const UserId = createParamDecorator(
  //  @UserId('id')  이런식으로 parameter에 들어가는 값이 data로 들어옴
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    // if (!request || !request.user || !request.user.sub) {
    //   throw new UnauthorizedException('사용자 정보를 찾을 수 없습니다!');
    // }

    return request?.user?.sub;
  },
);
