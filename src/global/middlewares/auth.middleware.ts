import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    let token: string | undefined;
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    
    if (!token && req.cookies?.access_token) {
      token = req.cookies.access_token;
    }

    if (!token) {
      return next();
    }

    try {
      const decoded = await this.jwtService.verifyAsync<{ sub: number }>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const user = await this.usersService.findByUserId({ userId: decoded.sub });

      if (!user) {
        return next(new UnauthorizedException('User not found'));
      }

      req.user = user;
      return next();
    } catch (error) {
      // JWT 검증 실패시 인증 없이 진행 (선택적 인증)
      return next();
    }
  }
}
