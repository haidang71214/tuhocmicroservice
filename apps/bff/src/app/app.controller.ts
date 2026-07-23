import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  getHealth() {
    return {
      status: 'ok',
      message: 'E-bff API Service is running',
      docs: '/api/v2/docs',
      timestamp: new Date().toISOString(),
    };
  }
}
