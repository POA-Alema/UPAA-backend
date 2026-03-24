import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Uma Porto Alegre Alemã API')
    .setDescription('API para gerenciamento de obras e pontos turísticos')
    .setVersion('1.0')
    .addTag('constructions')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors(); 

  await app.listen(3001);
}
bootstrap();
