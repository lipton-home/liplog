import { Controller, Get, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UsersService } from 'src/users/services/users.service';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  @Get('github/callback')
  async githubCallback(@Query('code') code: string, @Res() res: Response) {
    const accessToken = await this.authService.getGithubAccessToken({ code });
    const githubUser = await this.authService.getGithubUser({ accessToken });

    const user =
      (await this.usersService.findByGithubId({
        githubId: githubUser.id.toString(),
      })) ??
      (await this.usersService.createUser({
        githubId: githubUser.id.toString(),
        name: githubUser.login,
      }));

    const refreshToken = await this.authService.createRefreshToken({
      userId: user.id,
    });

    const jwtToken = this.jwtService.sign({
      sub: user.id,
    });

    res.cookie('access_token', jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL ',
      'http://localhost:3000',
    );

    res.redirect(`${frontendUrl}`);
  }
}
