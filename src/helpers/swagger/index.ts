import { INestApplication, Logger } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

import { SwaggerUI } from './swagger-ui.class';
import { _SWAGGER_TAGS } from './swagger-tags/swagger-tags.constants';

export class Swagger {
  private readonly logger = new Logger(Swagger.name);
  constructor(private readonly app: INestApplication) {}

  initSwagger() {
    const docBuilder = new DocumentBuilder()
      .setTitle('Chat-API')
      .setVersion('1.0')
      .addBearerAuth();

    _SWAGGER_TAGS.forEach((tag) => {
      docBuilder.addTag(tag.name, tag.description);
    });

    const swaggerConfig = docBuilder.build();

    const swaggerDocOptions: SwaggerDocumentOptions = {};

    const document = SwaggerModule.createDocument(
      this.app,
      swaggerConfig,
      swaggerDocOptions,
    );

    const swaggerUI = new SwaggerUI();
    SwaggerModule.setup(
      'api-documentation',
      this.app,
      document,
      swaggerUI.customOptions,
    );

    this.logger.log('Swagger module initialized');
  }
}
