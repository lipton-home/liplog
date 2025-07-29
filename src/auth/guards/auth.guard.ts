import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext<{ req: Request }>();

    const bearerToken = req.headers.authorization as string;

    if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid bearer token');
    }

    const accessToken = bearerToken.split(' ')[1];

    const userId = await this.extractUserId({ accessToken });

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    req.user = user;

    return true;
  }

  private async extractUserId(args: { accessToken: string }): Promise<number> {
    const { accessToken } = args;
    const { sub: userId } = await this.jwtService.verifyAsync<{ sub: number }>(
      accessToken,
      {
        secret: this.configService.get('JWT_SECRET'),
      },
    );
    return userId;
  }
}
