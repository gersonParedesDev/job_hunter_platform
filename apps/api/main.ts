import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from workspace root
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/config/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 API core is running on: http://localhost:${port}`);
}

bootstrap();
