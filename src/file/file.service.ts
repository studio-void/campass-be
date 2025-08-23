import {
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import fileConfig from './file.config';
import { Readable } from 'stream';
import { UploadFile, FileConfig } from './file.types';

@Injectable()
export class FileService {
  constructor(
    @Inject('S3_CLIENT') private readonly s3: S3Client,
    @Inject(fileConfig.KEY)
    private readonly fileConfigValues: FileConfig,
  ) {}

  /**
   * 단일 파일 업로드
   */
  async uploadFile(
    file: UploadFile,
    prefix?: string,
  ): Promise<{ key: string; url: string }> {
    const { bucketName, region } = this.fileConfigValues;

    if (!bucketName || !region) {
      throw new Error('AWS configuration is missing');
    }

    if (!file?.originalname || !file?.buffer || !file?.mimetype) {
      throw new Error('Invalid file provided');
    }

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');

    const key = prefix
      ? `${prefix}/${timestamp}_${randomString}_${sanitizedName}`
      : `${timestamp}_${randomString}_${sanitizedName}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

    return { key, url };
  }

  /**
   * 다중 파일 업로드 처리
   * Promise.all을 사용하여 여러 파일을 병렬로 업로드
   */
  async uploadFiles(
    files: UploadFile[],
    userId: string,
  ): Promise<{
    success: boolean;
    files: Array<{
      originalname: string;
      key: string;
      url: string;
      size: number;
      type: string;
    }>;
  }> {
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const { key, url } = await this.uploadFile(file, `uploads/${userId}`);

        return {
          originalname: file.originalname,
          key,
          url,
          size: file.size,
          type: file.mimetype,
        };
      }),
    );

    return {
      success: true,
      files: uploadedFiles,
    };
  }

  /**
   * 파일 다운로드
   */
  async getFile(key: string): Promise<Buffer> {
    const { bucketName } = this.fileConfigValues;

    if (!bucketName) {
      throw new Error('Bucket name is not configured');
    }

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const response = await this.s3.send(command);

    if (!response.Body) {
      throw new Error('Unable to retrieve file');
    }

    // ReadableStream을 Buffer로 변환
    const chunks: Uint8Array[] = [];
    const body = response.Body as Readable;

    return new Promise((resolve, reject) => {
      body.on('data', (chunk: Uint8Array) => chunks.push(chunk));
      body.on('error', reject);
      body.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  /**
   * 파일 삭제
   */
  async deleteFile(key: string): Promise<void> {
    const { bucketName } = this.fileConfigValues;

    if (!bucketName) {
      throw new Error('Bucket name is not configured');
    }

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await this.s3.send(command);
  }
}
