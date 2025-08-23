export interface UploadFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
  size: number;
}

export interface FileConfig {
  accessKey: string;
  secretAccessKey: string;
  region: string;
  bucketName: string;
}
