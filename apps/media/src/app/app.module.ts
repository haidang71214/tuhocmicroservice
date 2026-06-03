import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, TConfiguration } from '../Configuration';
import { MediaModule } from './media/media.module';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [() => CONFIGURATION] }), MediaModule],
  providers: [],
  exports: [],
})
export class MediaAppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;
}
