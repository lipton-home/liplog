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
    const token = req.headers.authorization?.split(' ')[1];
    if (!token || !token.startsWith('Bearer ')) {
      return next();
    }

    const decoded = await this.jwtService.verifyAsync<{ sub: number }>(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    const user = await this.usersService.findByUserId({ userId: decoded.sub });

    if (!user) {
      return next(new UnauthorizedException('User not found'));
    }

    req.user = user;

    return next();
  }
}
