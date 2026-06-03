import { Injectable } from '@nestjs/common';
import { UploadfileTcpRequest } from '@common/interfaces/tcp/media/media.request';
import { CloudinaryService } from '../../cloudinary/services/cloudinary.service';

@Injectable()
export class MediaService {
  constructor(private readonly cloudinryService: CloudinaryService) {}
  async uploadFile(data: UploadfileTcpRequest) {
    return this.cloudinryService.uploadFile(Buffer.from(data.fileBase64, 'base64'), data.fileName);
  }
}
