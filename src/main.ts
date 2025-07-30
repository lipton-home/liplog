import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsSetting } from './settings/cors-setting';
import { nodeMiddlewareSetting } from './settings/node-middleware-setting';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 글로벌 설정 적용
  corsSetting(app);
  nodeMiddlewareSetting(app);

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
