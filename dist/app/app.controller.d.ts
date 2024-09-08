import { AppService } from './app.service';
import { HealthCheckresponseDto } from './dto/healthCheck.response.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    healthCheck(): HealthCheckresponseDto;
}
