import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 기본값 false, 이걸 true로 하면 데코레이터에 없는 속성은 제거. 따라서 대부분  이 값을 true로 둔다.
      forbidNonWhitelisted: true, // 기본값 false, 이걸 true로 하면 데코레이터에 없는 속성은 에러 발생. 이 값은 false로 두는 경우 있음.
    }),
  ); // class-validator 사용하기 위해 필요
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
