import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/global/decorators/current-user.decorator';
import { UserDto } from '../dtos/user.dto';
import { UsersService } from '../services/users.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserDto, { nullable: true })
  user(
    @Args('userId', { type: () => ID }) userId: number,
  ): Promise<UserDto | null> {
    return this.usersService.findByUserId({ userId });
  }

  @UseGuards(AuthGuard)
  @Query(() => UserDto, { nullable: true })
  me(@CurrentUser() user: UserDto): UserDto {
    return user;
  }

  @Mutation(() => UserDto)
  updateUser(
    @Args('userId', { type: () => ID }) userId: number,
    @Args('name', { type: () => String }) name: string,
  ): Promise<UserDto> {
    return this.usersService.updateUser({ userId, name });
  }

  @Mutation(() => UserDto)
  deleteUser(
    @Args('userId', { type: () => ID }) userId: number,
  ): Promise<UserDto> {
    return this.usersService.deleteUser({ userId });
  }
}
