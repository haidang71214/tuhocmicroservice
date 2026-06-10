import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { IsNotEmpty, IsObject } from 'class-validator';

export enum GRPC_SERVICES {
  AUTHORIZER_SERVICE = 'GRPC_AUTHORIZER',
  USER_ACCESS_SERVICE = 'USER_ACCESS_SERVICE',
}

export class GrpcConfig {
  @IsObject()
  @IsNotEmpty()
  GRPC_AUTHORIZER_SERVICE: GrpcOptions & { name: string };

  // @IsObject()
  // @IsNotEmpty()
  // GRPC_USER_ACCESS_SERVICE: GrpcOptions & { name: string };

  constructor() {
    this.GRPC_AUTHORIZER_SERVICE = GrpcConfiguration.setValue({
      key: GRPC_SERVICES.AUTHORIZER_SERVICE,
      protoPath: ['./proto/authorizer.proto'],
      host: process.env['AUTHORIZER_gRPC_HOST'] || 'localhost',
      port: Number(process.env['AUTHORIZER_gRPC_PORT']) || 5100,
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
      },
    };
  }
}
