import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { firstValueFrom, map } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { v4 as uuidv4 } from 'uuid';
import { GithubUserDto } from '../dtos/github-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  public async authenticateByGithub(args: { code: string }): Promise<User> {
    const { code } = args;

    const accessToken = await this.getGithubAccessToken({ code });

    const data = await this.getGithubUser({ accessToken });

    const user = await this.prisma.user.upsert({
      where: {
        githubId: data.id.toString(),
      },
      update: {
        name: data.login,
      },
      create: {
        githubId: data.id.toString(),
        name: data.login,
      },
    });

    return user;
  }

  public async createRefreshToken(args: { userId: number }): Promise<string> {
    const { userId } = args;

    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });

    const refreshToken = uuidv4();

    await this.redisService.set(
      `refresh_token:${refreshToken}`,
      user.id,
      'EX',
      60 * 60 * 24 * 30,
    );

    return refreshToken;
  }

  public async getUserIdByRefreshToken(args: {
    refreshToken: string;
  }): Promise<number> {
    const { refreshToken } = args;

    const userId = await this.redisService.get(`refresh_token:${refreshToken}`);

    if (!userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return Number(userId);
  }

  private async getGithubUser(args: {
    accessToken: string;
  }): Promise<GithubUserDto> {
    const data = await firstValueFrom<GithubUserDto>(
      this.httpService
        .get('https://api.github.com/user', {
          headers: { Authorization: `Bearer ${args.accessToken}` },
        })
        .pipe(map((res) => res.data as GithubUserDto)),
    );

    return data;
  }

  private async getGithubAccessToken(args: { code: string }): Promise<string> {
    const clientId = this.configService.getOrThrow<string>('GITHUB_CLIENT_ID');
    const clientSecret = this.configService.getOrThrow<string>(
      'GITHUB_CLIENT_SECRET',
    );

    const { access_token } = await firstValueFrom<{ access_token: string }>(
      this.httpService
        .post('https://github.com/login/oauth/access_token', {
          client_id: clientId,
          client_secret: clientSecret,
          code: args.code,
        })
        .pipe(map((res) => res.data as { access_token: string })),
    );

    return access_token;
  }
}
