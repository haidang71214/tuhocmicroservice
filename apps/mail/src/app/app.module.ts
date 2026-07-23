import { Module } from '@nestjs/common';
import { CONFIGURATION, TConfiguration } from '../Configuration';
import { ConfigModule } from '@nestjs/config';
import { EmailController } from './email/email.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
  ],
  controllers: [EmailController],
  providers: [],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;
}
