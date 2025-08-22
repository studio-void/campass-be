import { Module } from '@nestjs/common';
import { DormController } from './dorm.controller';
import { DormService } from './dorm.service';

@Module({
  controllers: [DormController],
  providers: [DormService]
})
export class DormModule {}
