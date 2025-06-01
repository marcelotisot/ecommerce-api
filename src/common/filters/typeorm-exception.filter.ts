import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class TypeORMExceptionFilter implements ExceptionFilter {

  catch(exception: QueryFailedError, host: ArgumentsHost) {

    const ctx      = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status  = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';

    const driverError = (exception as any).driverError;

    if (driverError?.code === '23505') {

      // Unique violation (PostgreSQL)
      status = HttpStatus.CONFLICT;
      message = 'Duplicate entry';

    } else if (driverError?.code === '23503') {

      // Foreign key violation (PostgreSQL)
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid foreign key';

    } else if (driverError?.code === '23502') {

      // Not null violation
      status = HttpStatus.BAD_REQUEST;
      message = 'Missing required field';

    }

    response.status(status).json({
      statusCode: status,
      message,
      error: driverError?.detail || exception.message,
    });

  }
}
