import { User } from '@prisma/client';

declare global {
  interface BigInt {
    toJSON(): string;
  }

  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
