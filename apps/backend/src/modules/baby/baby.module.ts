import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BabyController } from './baby.controller';
import { BabyService } from './baby.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const random = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${random}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [BabyController],
  providers: [BabyService],
  exports: [BabyService],
})
export class BabyModule {}
