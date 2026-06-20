import { Injectable } from '@nestjs/common';
import { HOST } from '@common/constant/common.constant';

@Injectable()
export class InvoiceService {
  getHello(hehe: string) {
    return `${hehe} running on port ${HOST}`;
  }
}
