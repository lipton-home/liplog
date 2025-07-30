import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-code.enum';

export interface IBaseException {
  errorCode: ErrorCode;
  statusCode: HttpStatus;
  message: string;
}

export class BaseException<T extends ErrorCode = ErrorCode>
  extends HttpException
  implements IBaseException
{
  constructor(errorCode: T, message: string | string[], statusCode: number) {
    super(message, statusCode);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }
  errorCode: ErrorCode;
  statusCode: HttpStatus;
}
