import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.enableCors({
  //     origin: '*',
  //     credentials: true,
  //     // all headers that client are allowed to use
  //     allowedHeaders: [
  //       'Accept',
  //       'Authorization',
  //       'Content-Type',
  //       'X-Requested-With',
  //       'apollo-require-preflight',
  //       "x-apollo-operation-name"
  //     ],
  //     methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  //   });

  // Configura prefijo
  app.setGlobalPrefix('api');

  // Validaciones
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Nuevo puerto
  await app.listen(4000);
}
bootstrap();
