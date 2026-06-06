import { BaseConfiguration } from '@common/configuration/base.config';
import { AppConfiguration } from '@common/configuration/app.config';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TcpConfiguration } from '@common/configuration/tcp.config';
import { RedisConfiguration } from '@common/configuration/redis.config';
import { GrpcConfig } from '@common/configuration/gRPC.config';
import { StripeConfiguration } from '@common/configuration/stripe.config';
class Configuration extends BaseConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG = new AppConfiguration();
  @ValidateNested()
  @Type(() => TcpConfiguration)
  TCP_SERV = new TcpConfiguration();
  @ValidateNested()
  @Type(() => RedisConfiguration)
  REDIS_SERV = new RedisConfiguration();
  @ValidateNested()
  @Type(() => GrpcConfig)
  GRPC_CONFIG = new GrpcConfig();
  @ValidateNested()
  @Type(() => StripeConfiguration)
  STRIPE_CONFIG = new StripeConfiguration();
}

export const CONFIGURATION = new Configuration();
export type TConfiguration = typeof CONFIGURATION;

CONFIGURATION.validate();
