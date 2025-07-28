import { Module } from '@nestjs/common';
import { PostsService } from './services/posts.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedisModule } from 'src/redis/redis.module';
import { OpensearchModule } from 'src/opensearch/opensearch.module';
import { PostsResolver } from './resolvers/posts.resolver';

@Module({
  imports:[
    PrismaModule,
    RedisModule,
    OpensearchModule
  ],
  providers: [PostsResolver, PostsService],
})
export class PostsModule {}
