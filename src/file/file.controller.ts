import {
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { FileService } from './file.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UserId } from 'src/user/user.decorator';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { Response } from 'express';
import { UploadFile } from './file.types';

@ApiBearerAuth('jwt')
@Controller('files')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload/single')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '단일 파일 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '업로드할 파일',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: '파일 업로드 성공',
    schema: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          example: 'profiles/1640995200000_abc123_image.jpg',
        },
        url: {
          type: 'string',
          example:
            'https://bucket-name.s3.region.amazonaws.com/profiles/1640995200000_abc123_image.jpg',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: '잘못된 파일 형식 또는 크기' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async uploadSingleFile(
    @UserId() userId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|gif|pdf|doc|docx)$/,
          }),
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
        ],
      }),
    )
    file: UploadFile,
    @Query('prefix') prefix?: string,
  ) {
    return await this.fileService.uploadFile(file, prefix);
  }

  @Post('upload/multiple')
  @UseInterceptors(FilesInterceptor('files', 5)) // 최대 5개 파일
  @ApiOperation({ summary: '다중 파일 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: '업로드할 파일들 (최대 5개)',
        },
      },
      required: ['files'],
    },
  })
  @ApiResponse({
    status: 201,
    description: '파일 업로드 성공',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        files: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              originalname: { type: 'string', example: 'image.jpg' },
              key: {
                type: 'string',
                example: 'uploads/1/1640995200000_abc123_image.jpg',
              },
              url: {
                type: 'string',
                example:
                  'https://bucket-name.s3.region.amazonaws.com/uploads/1/1640995200000_abc123_image.jpg',
              },
              size: { type: 'number', example: 1024 },
              type: { type: 'string', example: 'image/jpeg' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: '잘못된 파일 형식 또는 크기' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async uploadMultipleFiles(
    @UserId() userId: number,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
        ],
      }),
    )
    files: UploadFile[],
  ) {
    return await this.fileService.uploadFiles(files, userId.toString());
  }

  @Get(':key')
  @ApiOperation({ summary: '파일 다운로드' })
  @ApiParam({
    name: 'key',
    description: '다운로드할 파일의 키',
    example: 'profiles/1640995200000_abc123_image.jpg',
  })
  @ApiResponse({
    status: 200,
    description: '파일 다운로드 성공',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @ApiResponse({ status: 404, description: '파일을 찾을 수 없음' })
  async getFile(@Param('key') key: string, @Res() res: Response) {
    try {
      const fileBuffer = await this.fileService.getFile(key);

      // 파일 확장자에 따른 Content-Type 설정
      const extension = key.split('.').pop()?.toLowerCase();
      let contentType = 'application/octet-stream';

      if (extension) {
        const mimeTypes: { [key: string]: string } = {
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          png: 'image/png',
          gif: 'image/gif',
          pdf: 'application/pdf',
          txt: 'text/plain',
          doc: 'application/msword',
          docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        };
        contentType = mimeTypes[extension] || contentType;
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${key.split('/').pop()}"`,
      );
      res.send(fileBuffer);
    } catch {
      res.status(404).json({ message: 'File not found' });
    }
  }

  @Delete(':key')
  @ApiOperation({ summary: '파일 삭제' })
  @ApiParam({
    name: 'key',
    description: '삭제할 파일의 키',
    example: 'profiles/1640995200000_abc123_image.jpg',
  })
  @ApiResponse({
    status: 200,
    description: '파일 삭제 성공',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: '파일이 성공적으로 삭제되었습니다.',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 404, description: '파일을 찾을 수 없음' })
  async deleteFile(@UserId() userId: number, @Param('key') key: string) {
    try {
      await this.fileService.deleteFile(key);
      return { message: '파일이 성공적으로 삭제되었습니다.' };
    } catch {
      throw new Error('File not found or unable to delete');
    }
  }
}
