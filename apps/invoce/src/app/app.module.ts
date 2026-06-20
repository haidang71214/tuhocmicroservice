import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoProvider } from '@common/configuration/mongo.config';
import { InvoiceModule } from './modules/invoice.module';
import { CONFIGURATION, TConfiguration } from '../Configuration';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [() => CONFIGURATION] }), MongoProvider, InvoiceModule],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;
}
