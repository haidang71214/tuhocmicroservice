import { Module } from '@nestjs/common';
import { CloudinaryModules } from '../cloudinary/cloudinary.modules';
import { MediaController } from './controllers/media.controller';
import { MediaService } from './services/media.service';

@Module({
  imports: [CloudinaryModules],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
