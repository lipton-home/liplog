import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from '../dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  public async findByUserId(args: { userId: number }): Promise<UserDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: args.userId },
    });

    return user;
  }
}
