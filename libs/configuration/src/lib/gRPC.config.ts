import { ClientsProviderAsyncOptions, GrpcOptions, GrpcService, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { IsNotEmpty, IsObject } from 'class-validator';
import { ConfigModule, ConfigService } from '@nestjs/config';

export enum GRPC_SERVICES {
  // chỗ này, mình đang thiết kế key-value với value trùng với tên của package .proto
  // package authorizer = "GRPC_AUTHORIZER_SERVICE" trong ./proto
  AUTHORIZER_SERVICE = 'GRPC_AUTHORIZER_SERVICE',
  USER_ACCESS_SERVICE = 'GRPC_USER_ACCESS_SERVICE',
}

export class GrpcConfig {
  @IsObject()
  @IsNotEmpty()
  GRPC_AUTHORIZER_SERVICE: GrpcOptions & { name: string };

  @IsObject()
  @IsNotEmpty()
  GRPC_USER_ACCESS_SERVICE: GrpcOptions & { name: string };

  constructor() {
    this.GRPC_AUTHORIZER_SERVICE = GrpcConfiguration.setValue({
      key: GRPC_SERVICES.AUTHORIZER_SERVICE,
      protoPath: ['./proto/authorizer.proto'],
      host: process.env['AUTHORIZER_gRPC_HOST'] || 'localhost',
      port: Number(process.env['AUTHORIZER_gRPC_PORT']) || 5100,
    });

    this.GRPC_USER_ACCESS_SERVICE = GrpcConfiguration.setValue({
      key: GRPC_SERVICES.USER_ACCESS_SERVICE,
      protoPath: ['./proto/user-access.proto'],
      host: process.env['USER_ACCESS_gRPC_HOST'] || 'localhost',
      port: Number(process.env['USER_ACCESS_gRPC_PORT']) || 5200,
    });
  }
}

export class GrpcConfiguration {
  static setValue({
    key,
    protoPath,
    port = 5100,
    host = '127.0.0.1',
  }: {
    key: GRPC_SERVICES;
    protoPath: string | string[];
    port?: number;
    host?: string;
  }): GrpcOptions & { name: string } {
    return {
      name: key,
      transport: Transport.GRPC,
      options: {
        package: key,
        protoPath: Array.isArray(protoPath)
          ? protoPath.map((path) => join(__dirname, path))
          : join(__dirname, protoPath),
        url: `${host}:${port}`,
        loader: {
          includeDirs: [join(__dirname, './proto')],
        },
      },
    };
  }
}
// cái này đơn giản thôi, nạp vô config ở bên kia, thì cái này nó sẽ đọc
// dữ kiện trong cái GRPC_CONFIG vì GRPC_CONFIG = new GrpcConfiguration().

export const gRPCPRovider = (serviceName: GRPC_SERVICES): ClientsProviderAsyncOptions => {
  return {
    name: serviceName,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      return config.get<GrpcOptions & { name: string }>(`GRPC_CONFIG.${serviceName}`)!;
    },
  };
};
