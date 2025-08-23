import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DormModule } from './dorm/dorm.module';
import { WikiModule } from './wiki/wiki.module';
import { ResearchModule } from './research/research.module';
import { FacilityModule } from './facility/facility.module';
import { TimetableModule } from './timetable/timetable.module';
import { FileModule } from './file/file.module';
import jwtConfig from './auth/jwt/jwt.config';
import userConfig from './user/user.config';
import fileConfig from './file/file.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [jwtConfig, userConfig, fileConfig],
    }),
    AuthModule,
    UserModule,
    DormModule,
    WikiModule,
    ResearchModule,
    FacilityModule,
    TimetableModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
