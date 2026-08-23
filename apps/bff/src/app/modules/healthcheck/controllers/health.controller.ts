import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';
import { HealthService } from '../service/health.service';

@ApiTags('Health check')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}
  // api kiểm tra sever còn sống hay không.
  @Get('liveness')
  @HealthCheck()
  checkLive() {
    return this.healthService.checkMemoryHeap();
  }
  // api check sự sẵn sàng của service-app.
  @Get('readiness')
  @HealthCheck()
  checkReady() {
    return this.healthService.checkReadiness();
  }
}
