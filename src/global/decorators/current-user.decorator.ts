import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { UserDto } from 'src/users/dtos/user.dto';

export const CurrentUser = createParamDecorator(
  (data, ctx: ExecutionContext): UserDto | null | undefined => {
    const gqlContext = GqlExecutionContext.create(ctx);
    const { req } = gqlContext.getContext<{ req: Request }>();
        
    return req.user;
  },
);
