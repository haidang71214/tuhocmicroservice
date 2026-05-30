import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, TConfiguration } from '../Configuration';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [() => ({ ...CONFIGURATION })] })],
  controllers: [],
  providers: [],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;
}
