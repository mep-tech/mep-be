import { ConfigService } from '@nestjs/config';
import { NestApplication } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default async function swaggerInit(app: NestApplication) {
  const configService = app.get(ConfigService);
  const apiTitle: string = configService.get<string>('API_TITLE');

  const config = new DocumentBuilder()
    .setTitle(apiTitle)
    .setDescription(
      'This is the swagger documentation for the Mep Erictric platform APIS.',
    )
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
