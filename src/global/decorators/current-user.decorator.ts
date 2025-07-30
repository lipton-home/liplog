import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserDto } from 'src/users/dtos/user.dto';

export const CurrentUser = createParamDecorator(
  (data, ctx: ExecutionContext): UserDto | null | undefined => {
    const user =
      GqlExecutionContext.create(ctx).getContext<RequestContext>().user;

    return user;
  },
);
