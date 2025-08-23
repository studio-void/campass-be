import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DormModule } from './dorm/dorm.module';
import { WikiModule } from './wiki/wiki.module';
import { ResearchModule } from './research/research.module';
import { FacilityModule } from './facility/facility.module';
import jwtConfig from './auth/jwt/jwt.config';
import userConfig from './user/user.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [jwtConfig, userConfig],
    }),
    AuthModule,
    UserModule,
    DormModule,
    WikiModule,
    ResearchModule,
    FacilityModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
