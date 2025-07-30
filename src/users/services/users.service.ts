import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from '../dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  public async findByUserId(args: { userId: number }): Promise<UserDto | null> {
    return this.prisma.user.findUnique({
      where: { id: args.userId },
    });
  }

  public async findByGithubId(args: {
    githubId: string;
  }): Promise<UserDto | null> {
    return this.prisma.user.findUnique({
      where: { githubId: args.githubId },
    });
  }

  public async createUser(args: {
    githubId: string;
    name: string;
  }): Promise<UserDto> {
    const { githubId, name } = args;

    return this.prisma.user.create({
      data: {
        githubId,
        name,
      },
    });
  }

  public async updateUser(args: {
    userId: number;
    name: string;
  }): Promise<UserDto> {
    const { userId, name } = args;

    return this.prisma.user.update({
      where: { id: userId },
      data: { name },
    });
  }

  public async deleteUser(args: { userId: number }): Promise<UserDto> {
    const { userId } = args;

    return this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });
  }
}
