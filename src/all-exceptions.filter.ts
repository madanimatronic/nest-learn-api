import { ArgumentsHost, BadRequestException, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import z, { ZodError } from 'zod';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    let exceptionOverride = exception;

    // Добавлять другие виды ошибок ниже
    if (exception instanceof ZodError) {
      exceptionOverride = new BadRequestException({
        message: 'Validation Error',
        error: z.flattenError(exception),
        statusCode: 400,
      });
    }

    super.catch(exceptionOverride, host);
  }
}
