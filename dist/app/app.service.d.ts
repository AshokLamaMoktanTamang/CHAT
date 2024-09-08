import { HealthCheckresponseDto } from './dto/healthCheck.response.dto';
import { MongoService } from '@/database/mongo/mongo.service';
export declare class AppService {
    private readonly mongoService;
    constructor(mongoService: MongoService);
    healthCheck(): HealthCheckresponseDto;
}
