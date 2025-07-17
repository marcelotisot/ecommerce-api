/*
* Filtro para atrapas excepciones comunes de TypeORM
*/

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';

import {
  QueryFailedError,
  EntityNotFoundError,
  CannotCreateEntityIdMapError,
} from 'typeorm';

@Catch(QueryFailedError, EntityNotFoundError, CannotCreateEntityIdMapError)
export class TypeOrmExceptionFilter implements ExceptionFilter {

  private readonly logger = new Logger(TypeOrmExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {

    const ctx      = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request  = ctx.getRequest<Request>();

    let status  = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details: string | undefined;

    if (exception instanceof QueryFailedError) {
      const err = exception as any;

      // PostgreSQL error codes
      const code = err.driverError?.code;

      switch (code) {

        case '23505': // unique_violation
          status  = HttpStatus.CONFLICT;
          message = 'Duplicate entry.';
          details = err.detail;
          break;

        case '23503': // foreign_key_violation
          status  = HttpStatus.BAD_REQUEST;
          message = 'Foreign key constraint violation.';
          details = err.detail;
          break;
        case '23502': // not_null_violation

          status  = HttpStatus.BAD_REQUEST;
          message = 'Missing required field.';
          details = err.detail;
          break;

        default:
          status  = HttpStatus.BAD_REQUEST;
          message = err.message || 'Database query error';
          details = err.detail;
          break;

      }
    } else if (exception instanceof EntityNotFoundError) {

      status  = HttpStatus.NOT_FOUND;
      message = 'Entity not found.';

    } else if (exception instanceof CannotCreateEntityIdMapError) {

      status  = HttpStatus.BAD_REQUEST;
      message = 'Could not create entity ID map.';

    }

    this.logger.error(
      `[TypeORM] ${message} - ${request.method} ${request.url}`,
    );

    response.status(status).json({

      statusCode: status,
      message,
      ...(details && { details }),
      timestamp: new Date().toISOString(),
      path: request.url,

    });

  }

}