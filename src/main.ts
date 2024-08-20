import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import swaggerInit from './doc/swagger';

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  const logger = new Logger();

  app.setGlobalPrefix('api/v1');
  /* Swagger documentation */
  await swaggerInit(app);
  await app.listen(port || 3000);

  logger.verbose(`⚡⚡⚡ App running on: http://localhost:${port} ⚡⚡⚡\n`);
}
bootstrap();
