import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly redisClient: Redis;
  constructor(private readonly configService: ConfigService) {
    this.redisClient = new Redis({
      host: configService.get('REDIS_HOST', 'localhost'),
      port: configService.get('REDIS_PORT', 6379),
    });
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
    this.logger.log('Redis disconnected');
  }
}
