import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Request } from 'express';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { MiddlewaresModule } from './global/middlewares/middlewares.module';
import { OpensearchModule } from './opensearch/opensearch.module';
import { PostsModule } from './posts/posts.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';

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
      context: ({ req }: { req: Request }) => {
        return req.context;
      },
    }),
    AuthModule,
    RedisModule,
    OpensearchModule,
    PostsModule,
    UsersModule,
    MiddlewaresModule,
  ],

  controllers: [AppController],
})
export class AppModule {}
