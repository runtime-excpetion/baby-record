import { Module } from '@nestjs/common';
import { SupplementController } from './supplement.controller';
import { SupplementService } from './supplement.service';

@Module({
  controllers: [SupplementController],
  providers: [SupplementService],
  exports: [SupplementService],
})
export class SupplementModule {}
