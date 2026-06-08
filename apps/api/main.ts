import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from workspace root
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/config/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Configure Swagger Document
  const config = new DocumentBuilder()
    .setTitle('Job Hunter Platform API')
    .setDescription('The Core API for Job Hunter Monorepo. Handles CRUD, calculations, and enqueuing tasks.')
    .setVersion('1.0')
    .addTag('Profiles')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 API core is running on: http://localhost:${port}`);
  console.log(`📖 Swagger Documentation available at: http://localhost:${port}/docs`);
}

bootstrap();
