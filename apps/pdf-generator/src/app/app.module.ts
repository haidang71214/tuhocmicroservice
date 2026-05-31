import { Module } from '@nestjs/common';
import { PdfModule } from './pdf/app.module';
import { CONFIGURATION, TConfiguration } from '../Configuration';

@Module({
  imports: [PdfModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;
}
