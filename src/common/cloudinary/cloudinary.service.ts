import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import * as fs from 'fs';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File | { path?: string, buffer?: any },
    folder: string = '',
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: `mep/${folder}`,
          unique_filename: true,
        },

        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        },
      );

      if (file.buffer) {
        upload.end(file.buffer);
      } else if (file.path) {
        const fileStream = fs.createReadStream(file.path);
        fileStream.pipe(upload);
      }
    });
  }

  async removeImage(
    url: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    try {
      const publicId = 'mep/'.concat(
        url
          .split('/mep/')
          .slice(1)
          .join('/mep/')
          .split('.')
          .slice(0, -1)
          .join('.'),
      );

      if (!publicId) {
        throw new Error('Invalid URL');
      }

      return new Promise((resolve, reject) => {
        v2.uploader.destroy(publicId, (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        });
      });
    } catch (error) {
      throw new Error(`Failed to remove image: ${error.message}`);
    }
  }
}
