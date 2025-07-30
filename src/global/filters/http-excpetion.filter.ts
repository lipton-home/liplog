import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  LoggerService,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlContextType } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { GraphQLError } from 'graphql';
import { BaseException } from '../exceptions/base.exception';
import { BaseErrorCode } from '../exceptions/error-code.enum';

@Catch(HttpException, BaseException)
export class HttpExceptionFilter<T extends HttpException>
  implements ExceptionFilter
{
  constructor(private readonly logger: LoggerService) {}

  catch(exception: T, host: ArgumentsHost) {
    const isGraphQL = host.getType<GqlContextType>() === 'graphql';
    let request: Request;
    let response: Response;
    let needToLog: boolean = false;

    const errorCode =
      exception instanceof BaseException
        ? exception.errorCode
        : BaseErrorCode.INTERNAL_SERVER_ERROR;
    const exceptionMessage = exception.message;

    if (isGraphQL) {
      const ctx = GqlArgumentsHost.create(host).getContext<{
        req: Request;
        res: Response;
      }>();
      response = ctx.res;
      request = ctx.req;
    } else {
      const ctx = host.switchToHttp();
      response = ctx.getResponse<Response>();
      request = ctx.getRequest<Request>();
    }

    const status = exception.getStatus();
    if (
      status >= 500 ||
      (isGraphQL && errorCode === BaseErrorCode.INTERNAL_SERVER_ERROR)
    ) {
      needToLog = true;
    }

    const userId = request.user?.id;
    const method = request.method;
    const path = request.path;
    const query = JSON.stringify(request.query);
    const body = JSON.stringify(request.body);
    const stack = exception.stack;
    const userAgent = request.headers['user-agent'];

    if (needToLog) {
      this.logger.error(
        `[${errorCode}] ${exceptionMessage}\n on \n method:${method} \n path:${path} query:${query} \n body:${body} \n by userId: ${userId} \n user-agent: ${userAgent}`,
        stack,
        HttpExceptionFilter.name,
      );
    }

    if (isGraphQL) {
      return new GraphQLError(exceptionMessage, {
        extensions: {
          code: errorCode,
          timestamp: new Date().toISOString(),
        },
      });
    }

    response.status(status).json({
      errorCode,
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
