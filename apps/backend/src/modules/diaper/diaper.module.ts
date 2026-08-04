import { Module } from '@nestjs/common';
import { DiaperController } from './diaper.controller';
import { DiaperService } from './diaper.service';

@Module({
  controllers: [DiaperController],
  providers: [DiaperService],
  exports: [DiaperService],
})
export class DiaperModule {}
