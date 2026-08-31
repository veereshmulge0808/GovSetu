import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  GetObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

export interface StoredFile {
  key: string;
  url: string;
  bucket: string;
  sizeBytes: number;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    const endpoint = config.get<string>('STORAGE_ENDPOINT', 'http://localhost:9000');
    const region = config.get<string>('STORAGE_REGION', 'us-east-1');

    this.s3 = new S3Client({
      endpoint,
      region,
      credentials: {
        accessKeyId: config.get<string>('STORAGE_ACCESS_KEY', 'minioadmin'),
        secretAccessKey: config.get<string>('STORAGE_SECRET_KEY', 'minioadmin'),
      },
      forcePathStyle: true, // Required for MinIO
    });

    this.bucket = config.get<string>('STORAGE_BUCKET_NAME', 'govsetu-documents');
  }

  /**
   * Upload a file buffer to object storage.
   * Returns the storage key and a pre-signed URL.
   */
  async uploadFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    folder = 'documents',
  ): Promise<StoredFile> {
    const ext = originalName.split('.').pop() ?? 'bin';
    const key = `${folder}/${uuidv4()}.${ext}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
        ContentDisposition: `attachment; filename="${originalName}"`,
      }),
    );

    const url = await this.getPresignedUrl(key);
    this.logger.log(`File uploaded: ${key} (${buffer.length} bytes)`);

    return { key, url, bucket: this.bucket, sizeBytes: buffer.length };
  }

  /**
   * Generate a short-lived pre-signed download URL for a stored object.
   */
  async getPresignedUrl(key: string, expirySeconds = 3600): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.s3, command, { expiresIn: expirySeconds });
  }

  /**
   * Delete a stored object.
   */
  async deleteFile(key: string): Promise<void> {
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
    this.logger.log(`File deleted: ${key}`);
  }
}
