import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from 'src/redis/redis.module';
import { AuthResolver } from './resolvers/auth.resolver';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthResolver, AuthGuard],
})
export class AuthModule {}
