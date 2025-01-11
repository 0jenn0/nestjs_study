import { Module } from '@nestjs/common';
import { MovieModule } from './movie/movie.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [],
      synchronize: true, // production에서는 true로 하면 절대 안됨. 코드와 맞게 데이터베이스를 싱크를 맞춘다는건데,
      // 이렇게하면 production 데이터베이스가 날아갈 수 있는 여지가 있기 때문이다.
      // production 모드에서는 보통 싱크를 migration으로 해결한다.
    }),
    MovieModule,
  ],
})
export class AppModule {}
