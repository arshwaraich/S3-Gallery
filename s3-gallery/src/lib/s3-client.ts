import AWS from 'aws-sdk';

export interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  region: string;
}

export class S3Client {
  private s3: AWS.S3;
  private config: S3Config;

  constructor(config: S3Config) {
    this.config = config;
    
    AWS.config.update({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      region: config.region,
    });

    this.s3 = new AWS.S3();
  }

  async listObjects(): Promise<AWS.S3.Object[]> {
    try {
      const params = {
        Bucket: this.config.bucketName,
        MaxKeys: 1000,
      };

      const response = await this.s3.listObjectsV2(params).promise();
      return response.Contents || [];
    } catch (error) {
      console.error('Error listing S3 objects:', error);
      throw new Error('Failed to fetch objects from S3 bucket');
    }
  }

  getSignedUrl(key: string, expires: number = 3600): string {
    return this.s3.getSignedUrl('getObject', {
      Bucket: this.config.bucketName,
      Key: key,
      Expires: expires,
    });
  }

  static isImageFile(filename: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    return imageExtensions.some(ext => 
      filename.toLowerCase().endsWith(ext)
    );
  }

  static isVideoFile(filename: string): boolean {
    const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v', '.wmv', '.flv'];
    return videoExtensions.some(ext => 
      filename.toLowerCase().endsWith(ext)
    );
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}