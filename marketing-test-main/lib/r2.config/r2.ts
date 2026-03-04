import { S3Client } from "@aws-sdk/client-s3";

const r2Client = new S3Client({
  region: 'auto', // R2 uses 'auto' region
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;


export { r2Client, BUCKET_NAME };
