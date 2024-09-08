import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';

@Injectable()
export class MongoService implements OnModuleInit {
  private readonly logger = new Logger('MongoService');
  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit() {
    this.setupDbListeners();
  }

  setupDbListeners() {
    this.logger.log('DB Listeneres initialized');
    this.logger.log(`Current MongoDB connection status: ${this.getDbStatus()}`);

    this.connection.on('connected', () => {
      this.logger.log('MongoDB connection connected.');
    });

    this.connection.on('error', (error) => {
      this.logger.error('MongoDB connection error:', error.message);
    });

    this.connection.on('disconnected', () => {
      this.logger.warn('MongoDB connection disconnected.');
    });
  }

  getDbStatus() {
    return ConnectionStates[this.connection.readyState];
  }
}
