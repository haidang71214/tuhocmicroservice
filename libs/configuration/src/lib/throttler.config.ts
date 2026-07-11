import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';

export const ThrottlerProvider = ThrottlerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService): ThrottlerModuleOptions => {
    return {
      throttlers: [
        {
          ttl: Number(config.get<number>('THROTTLE_TTL', 60000)),
          limit: Number(config.get<number>('THROTTLE_LIMIT', 5)),
        },
      ],
      errorMessage: 'Too many request,plese try again',
      storage: new ThrottlerStorageRedisService({
        host: config.get<string>('REDIS_HOST'),
        port: config.get<number>('REDIS_PORT'),
      }),
    };
  },
});
