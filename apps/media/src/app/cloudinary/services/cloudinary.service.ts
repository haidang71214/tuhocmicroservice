import { CloudinaryConfiguration } from '@common/configuration/cloudinary.config';
import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import * as path from 'path';

@Injectable()
export class CloudinaryService {
  private readonly clodinary = cloudinary;
  constructor(private readonly cloudinaryConfiguration: CloudinaryConfiguration) {
    this.clodinary.config({
      cloud_name: this.cloudinaryConfiguration.cloudinaryName,
      api_key: this.cloudinaryConfiguration.cloudinaryApiKey,
      api_secret: this.cloudinaryConfiguration.cloudinaryApiSecret,
    });
  }

  async uploadFile(fileBuffer: Buffer, fileName: string): Promise<string> {
    const fileInfo = path.parse(fileName);
    const ext = fileInfo.ext.replace('.', '');
    return new Promise((resolve, reject) => {
      const uploadStream = this.clodinary.uploader.upload_stream(
        {
          folder: 'einvoice-app',
          resource_type: 'auto',
          public_id: fileInfo.name,
          format: ext,
        },
        (error, result) => {
          if (error) {
            Logger.error('Upload error:', error);
            return reject(error);
          }
          Logger.log('Upload successful:', result);
          let secureUrl = result!.secure_url;
          if (ext && !secureUrl.endsWith(`.${ext}`)) {
            secureUrl = `${secureUrl}.${ext}`;
          }
          return resolve(secureUrl);
        },
      );
      Readable.from(fileBuffer).pipe(uploadStream);
    });
  }
}
