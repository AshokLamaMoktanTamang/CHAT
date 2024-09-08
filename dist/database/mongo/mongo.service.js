"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let MongoService = class MongoService {
    constructor(connection) {
        this.connection = connection;
        this.logger = new common_1.Logger('MongoService');
    }
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
        return mongoose_2.ConnectionStates[this.connection.readyState];
    }
};
exports.MongoService = MongoService;
exports.MongoService = MongoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Connection])
], MongoService);
//# sourceMappingURL=mongo.service.js.map