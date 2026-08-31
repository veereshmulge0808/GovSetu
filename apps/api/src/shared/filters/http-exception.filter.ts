import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  path: string;
  timestamp: string;
  requestId?: string;
}

/**
 * Global HTTP exception filter.
 * Transforms all HttpExceptions into a consistent JSON error structure.
 * Logs server errors (5xx) with full details.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string | string[];
    let error: string;

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const exRes = exceptionResponse as Record<string, unknown>;
      message = (exRes.message as string | string[]) ?? exception.message;
      error = (exRes.error as string) ?? HttpStatus[status];
    } else {
      message = exceptionResponse as string;
      error = HttpStatus[status];
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      error,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    // Log 5xx server errors with full stack trace
    if (status >= 500) {
      this.logger.error(
        `[${request.method}] ${request.url} → ${status}`,
        exception.stack,
      );
    } else if (status >= 400) {
      this.logger.warn(
        `[${request.method}] ${request.url} → ${status}: ${JSON.stringify(message)}`,
      );
    }

    response.status(status).json(errorResponse);
  }
}
