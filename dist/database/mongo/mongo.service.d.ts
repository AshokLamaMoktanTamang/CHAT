import { OnModuleInit } from '@nestjs/common';
import { Connection } from 'mongoose';
export declare class MongoService implements OnModuleInit {
    private readonly connection;
    private readonly logger;
    constructor(connection: Connection);
    onModuleInit(): void;
    setupDbListeners(): void;
    getDbStatus(): string;
}
