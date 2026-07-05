import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(

    new ValidationPipe({

      whitelist: true,

      forbidNonWhitelisted: true,

      transform: true,

    }),

  );

  app.useGlobalInterceptors(

    new LoggerInterceptor(),

  );

  app.useGlobalFilters(

    new HttpExceptionFilter(),

  );

  await app.listen(process.env.PORT || 3001);

  console.log(`✅ User Service ejecutándose en http://localhost:${process.env.PORT || 3001}`);

}

bootstrap();