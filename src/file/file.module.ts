import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { ConfigModule } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import fileConfig from './file.config';

interface FileConfig {
  accessKey: string;
  secretAccessKey: string;
  region: string;
  bucketName: string;
}

@Module({
  imports: [ConfigModule.forFeature(fileConfig)],
  providers: [
    FileService,
    {
      provide: 'S3_CLIENT',
      useFactory: (fileConfigValues: FileConfig) => {
        const { accessKey, secretAccessKey, region } = fileConfigValues;

        if (!accessKey || !secretAccessKey || !region) {
          throw new Error('AWS credentials are not properly configured');
        }

        return new S3Client({
          credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secretAccessKey,
          },
          region: region,
        });
      },
      inject: [fileConfig.KEY],
    },
  ],
  controllers: [FileController],
  exports: ['S3_CLIENT', FileService],
})
export class FileModule {}
