import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug'], // debug 레벨 로그만 출력되는게 아니라 그 위 레벨 로그도 출력된다.
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 기본값 false, 이걸 true로 하면 데코레이터에 없는 속성은 제거. 따라서 대부분  이 값을 true로 둔다.
      forbidNonWhitelisted: true, // 기본값 false, 이걸 true로 하면 데코레이터에 없는 속성은 에러 발생. 이 값은 false로 두는 경우 있음.
      transformOptions: {
        enableImplicitConversion: true, // class에 적혀있는 타입을 기반으로 우리가 입력하는 값들 타입을 변경하라는 뜻.
      },
    }),
  ); // class-validator 사용하기 위해 필요
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
