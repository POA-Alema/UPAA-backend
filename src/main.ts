import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = Number(process.env.PORT ?? 3000);

  const config = new DocumentBuilder()
    .setTitle('Uma Porto Alegre Alemã API')
    .setDescription('API para gerenciamento de obras e pontos turísticos')
    .setVersion('1.0')
    .addTag('buildings')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.enableCors();

  await app.listen(port, '0.0.0.0');
}

bootstrap();