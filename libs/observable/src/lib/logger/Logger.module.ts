import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { TransportTargetOptions } from 'pino';

@Module({})
export class LoggerModule {
  static forRoot(): DynamicModule {
    return {
      module: LoggerModule,
      imports: [
        PinoLoggerModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const targets: TransportTargetOptions[] = [];

            // 1. Pretty Print for non-production (Dev)
            if (configService.get('NODE_ENV') !== 'production') {
              targets.push({
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  translateTime: 'SYS:standard',
                  colorize: true,
                },
              });
            }

            return {
              pinoHttp: {
                transport:
                  targets.length > 0
                    ? {
                        targets,
                      }
                    : undefined,
                autoLogging: false,
                serializers: {
                  req: () => undefined,
                  res: () => undefined,
                },
              },
            };
          },
        }),
      ],
      exports: [PinoLoggerModule],
    };
  }
}
export { Logger } from 'nestjs-pino';
