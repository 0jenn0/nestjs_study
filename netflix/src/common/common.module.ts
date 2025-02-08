import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { v4 } from 'uuid';
import { TasksService } from './tasks.service';
import { Movie } from '@/movie/entity/movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefaultLogger } from './logger/default.logger';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(process.cwd(), 'public', 'temp'),
        filename: (req, file, cb) => {
          const uuid = v4();

          const split = file.originalname.split('.');
          let extension = 'mp4';

          if (split.length > 1) {
            extension = split[split.length - 1];
          }

          cb(null, `${uuid}_${Date.now()}.${extension}`);
        },
      }),
    }),
    TypeOrmModule.forFeature([Movie]),
  ],
  controllers: [CommonController],
  providers: [CommonService, TasksService, DefaultLogger],
  exports: [CommonService, DefaultLogger],
})
export class CommonModule {}
