import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';

import helmet from 'helmet';

import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

import { Reflector } from '@nestjs/core';

import { RolesGuard } from './auth/guards/roles.guard';

async function bootstrap(){


const app =
await NestFactory.create(AppModule);



app.use(helmet());



app.useGlobalPipes(

new ValidationPipe({

whitelist:true,

forbidNonWhitelisted:true

})

);


app.useGlobalGuards(

new JwtAuthGuard(
app.get(Reflector)
),


new RolesGuard(
app.get(Reflector)
)

);

await app.listen(3000);


}


bootstrap();