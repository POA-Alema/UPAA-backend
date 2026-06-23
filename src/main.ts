import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const port = Number(process.env.PORT ?? 3001);

  const config = new DocumentBuilder()
    .setTitle('Uma Porto Alegre Alemã API')
    .setDescription('API para gerenciamento de obras e pontos turísticos')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('buildings')
    .addTag('architects')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.enableCors();

  await app.listen(port, '0.0.0.0');
}

bootstrap();
