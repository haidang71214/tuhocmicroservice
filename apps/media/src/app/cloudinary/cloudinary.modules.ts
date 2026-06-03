import { Module } from '@nestjs/common';
import { CloudinaryService } from './services/cloudinary.service';
import { CONFIGURATION } from '../../Configuration';
import { CloudinaryConfiguration } from '@common/configuration/cloudinary.config';

@Module({
  providers: [
    {
      provide: CloudinaryConfiguration,
      useValue: CONFIGURATION.CLOUDINARY_CONFIG,
    },
    CloudinaryService,
  ],
  exports: [CloudinaryService],
})
export class CloudinaryModules {}
