import { Injectable } from '@nestjs/common';
import { HOST } from '@common/constant';
@Injectable()
export class AppService {
  getHello(hehe = 'User') {
    return `${hehe} running on port ${HOST}`;
  }
}
