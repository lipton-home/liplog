import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { OpensearchModule } from './opensearch/opensearch.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      cache: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), './schema.gql'),
      playground: true,
      sortSchema: true,
      fieldResolverEnhancers: ['guards', 'filters', 'interceptors'],
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          ...error,
        };
        return graphQLFormattedError;
      },
      context: ({ req }: { req: Request }) => ({
        req,
      }),
    }),
    AuthModule,
    RedisModule,
    OpensearchModule,
    PostsModule,
  ],

  controllers: [AppController],
})
export class AppModule {}
