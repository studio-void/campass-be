import { registerAs } from '@nestjs/config';

export default registerAs('file', () => {
  const accessKey = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION;
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  if (!accessKey || !secretAccessKey || !region || !bucketName) {
    throw new Error('AWS credentials and bucket name are not set');
  }

  return {
    accessKey,
    secretAccessKey,
    region,
    bucketName,
  };
});
