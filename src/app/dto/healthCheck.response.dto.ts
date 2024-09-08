import { IsBoolean, IsEnum } from "class-validator";
import { ConnectionStates } from "mongoose";

export class HealthCheckresponseDto {
    @IsEnum(ConnectionStates)
    databaseConnection: string

    @IsBoolean()
    serverStatus: boolean
}