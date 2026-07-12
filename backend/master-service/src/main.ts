import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

import { AppModule } from './app.module';

import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.useGlobalPipes(

    new ValidationPipe({

      whitelist: true,

      forbidNonWhitelisted: true,

      transform: true,

    }),

  );

  app.useGlobalGuards(

    app.get(JwtAuthGuard),

    app.get(RolesGuard),

  );

  await app.listen(3000);

}

bootstrap();