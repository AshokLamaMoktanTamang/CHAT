import { Injectable } from '@nestjs/common';

import { HealthCheckresponseDto } from './dto/healthCheck.response.dto';
import { MongoService } from '@/database/mongo/mongo.service';

@Injectable()
export class AppService {
  constructor(private readonly mongoService: MongoService) {}

  healthCheck(): HealthCheckresponseDto {
    return {
      databaseConnection: this.mongoService.getDbStatus(),
      serverStatus: true,
    };
  }
}
