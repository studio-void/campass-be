import { Module } from '@nestjs/common';
import { DormController } from './dorm.controller';
import { DormService } from './dorm.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DormController],
  providers: [DormService],
})
export class DormModule {}
