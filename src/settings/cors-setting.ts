import { INestApplication } from '@nestjs/common';

export function corsSetting(app: INestApplication) {
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
}
