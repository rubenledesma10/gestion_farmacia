import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enciende la validación global para todos los endpoints
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina campos basura que el frontend envíe de más
      forbidNonWhitelisted: true, // Lanza un error si envían campos no definidos en el DTO
    }),
  );

  // Permite que el frontend en React se conecte sin bloqueos de seguridad
  app.enableCors();

  await app.listen(3000);
}
void bootstrap();
