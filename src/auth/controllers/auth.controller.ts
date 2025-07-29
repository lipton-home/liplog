import { Controller, Get, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Get('github/callback')
  async githubCallback(@Query('code') code: string, @Res() res: Response) {
    const user = await this.authService.authenticateByGithub({ code });

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
