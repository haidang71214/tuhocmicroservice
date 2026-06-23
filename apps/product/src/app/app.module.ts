import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, TConfiguration } from '../Configuration';
import { ProductModule } from './modules/product/product.module';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [() => CONFIGURATION] }), ProductModule],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;
}
