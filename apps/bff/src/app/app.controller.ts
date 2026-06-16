import { BadRequestException, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { HTTP_MESSAGE } from '@invoce/constant';
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    const res = this.appService.getData();
    return new ResponseDto({ data: res });
  }
}
