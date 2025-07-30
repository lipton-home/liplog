import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
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
