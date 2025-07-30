import { Request } from 'express';
import { UserDto } from './users/dtos/user.dto';

export class RequestContext {
  req: Request;
  res: Response;

  public get user(): UserDto | null | undefined {
    return this.req.user;
  }

  public get userId(): number | null | undefined {
    return this.user?.id;
  }

  public set user(user: UserDto) {
    this.req.user = user;
  }
}
