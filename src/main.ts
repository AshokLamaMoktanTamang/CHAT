import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { RequestMethod, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app/app.module';
import { Swagger } from './helpers/swagger';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

(async function () {
  const app = await NestFactory.create(AppModule);
  const swagger = new Swagger(app);

  const config = app.get(ConfigService);
  const port = config.get<number>('app.port');

  app.setGlobalPrefix('api/v1');

  swagger.initSwagger();
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(port);
})();
