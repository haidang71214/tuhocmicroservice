import { ClientsProviderAsyncOptions, TcpClientOptions, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IsNotEmpty, IsObject } from 'class-validator';

export enum TCP_SERVICES {
  INVOICE_SERVICE = 'TCP_INVOICE_SERVICE',
  PRODUCT_SERVICE = 'TCP_PRODUCT_SERVICE',
}

export class TcpConfiguration {
  @IsNotEmpty()
  @IsObject()
  TCP_INVOICE_SERVICE!: TcpClientOptions;

  @IsNotEmpty()
  @IsObject()
  TCP_PRODUCT_SERVICE!: TcpClientOptions;

  constructor() {
    // môi trường ở constructor sẽ tồn tại khi chỉ mới khai báo, nên chỗ này giống kiểu nạp sẵn cho nó chạy ấy.
    Object.entries(TCP_SERVICES).forEach(([key, serviceName]) => {
      const host = process.env[`${key}_HOST`] || 'localhost';
      const port = Number(process.env[`${serviceName}_PORT`]) || 3301;

      (this as any)[serviceName] = TcpConfiguration.setValue(port, host);
    });
  }

  static setValue(port: number, host: string): TcpClientOptions {
    return { transport: Transport.TCP, options: { host, port } };
  }
}

// hàm kết nối bất đồng bộ
//  ClientsModule.register([{name:'TCP_INVOICE_SERVICCE',transport:Transport.TCP,options:{host:'localhost',port:3301}}])],
// nó đứng ra thay thế cho cái hàm trên để import vào app.module của bff đấy
export function TcpProvider(serviceName: keyof TcpConfiguration): ClientsProviderAsyncOptions {
  return {
    //do nó là môi trường cần nàp vào, config provider ở file riêng
    name: serviceName,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      return configService.get(`TCP_SERV.${serviceName}`) as TcpClientOptions;
    },
  };
}
