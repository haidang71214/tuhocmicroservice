import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoProvider } from '@common/configuration/mongo.config';
import { InvoiceModule } from './modules/invoice.module';
import { CONFIGURATION, TConfiguration } from '../Configuration';
import { LoggerModule } from '@common/observable';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [() => CONFIGURATION] }),
    MongoProvider,
    LoggerModule.forRoot('invoice'),
    InvoiceModule,
  ],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;
}
