import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { HealthCheckresponseDto } from './dto/healthCheck.response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  healthCheck(): HealthCheckresponseDto {
    return this.appService.healthCheck();
  }
}
