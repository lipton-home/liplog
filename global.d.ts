import { RequestContext } from './src/request-context';
import { UserDto } from './src/users/dtos/user.dto';

declare global {
  interface BigInt {
    toJSON(): string;
  }

  namespace Express {
    interface Request {
      context: RequestContext;
      user?: UserDto;
    }
  }
}
