import { INestApplication } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';

export function nodeMiddlewareSetting(app: INestApplication) {
  app.use(cookieParser());
  app.use(json({ limit: '20mb' }));
  app.use(urlencoded({ limit: '20mb', extended: true }));
}
