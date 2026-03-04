// lib/r2.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// R2 Configuration


 const   r2Client = new S3Client({
  region: 'auto', // R2 uses 'auto' region
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;

export interface UploadResult {
  success: boolean;
  key?: string;
  url?: string;
  error?: string;
}

export interface FileMetadata {
  originalName: string;
  size: number;
  type: string;
  stream: string;
  class: string;
  subject: string;
  title: string;
}

/**
 * Upload a file to R2 bucket
 */
export async function uploadToR2(
  file: File,
  metadata: FileMetadata
): Promise<UploadResult> {
  try {
    // Generate unique key for the file
    const timestamp = Date.now();
    const sanitizedTitle = metadata.title.replace(/[^a-zA-Z0-9]/g, '_');
    const fileExtension = file.name.split('.').pop();
    const key = `content/${metadata.stream}/${metadata.class}/${metadata.subject}/${sanitizedTitle}_${timestamp}.${fileExtension}`;

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      Metadata: {
        originalName: metadata.originalName,
        title: metadata.title,
        stream: metadata.stream,
        class: metadata.class,
        subject: metadata.subject,
        uploadedAt: new Date().toISOString(),
      },
    });

    await r2Client.send(command);

    // Generate public URL
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return {
      success: true,
      key,
      url: publicUrl,
    };
  } catch (error) {
    console.error('R2 Upload Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Get a signed URL for private file access
 */
export async function getSignedFileUrl(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error('Failed to generate file URL');
  }
}

/**
 * Delete a file from R2
 */
export async function deleteFromR2(key: string): Promise<boolean> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await r2Client.send(command);
    return true;
  } catch (error) {
    console.error('Error deleting file from R2:', error);
    return false;
  }
}

export { r2Client, BUCKET_NAME };
