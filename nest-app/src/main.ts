// Load environment variables early
require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });

  // Security middleware
  app.use(helmet());
  app.use(cookieParser());

  // Preserve raw body for webhook signature verification (Stripe)
  const rawBodySaver = (req: any, res: any, buf: Buffer, encoding: string) => {
    if (buf && buf.length) {
      // store raw body buffer for later signature verification
      req.rawBody = buf.toString(encoding || 'utf8');
    }
  };
  app.use(bodyParser.json({ verify: rawBodySaver }));
  app.use(bodyParser.urlencoded({ extended: true, verify: rawBodySaver }));

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

  // CORS - restrict in production via env
  const origin = process.env.CORS_ORIGIN || true;
  app.enableCors({ origin, credentials: true });

  const prefix = process.env.API_PREFIX || 'api';
  app.setGlobalPrefix(prefix);

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3333;
  await app.listen(port);
  Logger.log(`Nest backend running on http://localhost:${port}/${prefix}`);
}

bootstrap();
