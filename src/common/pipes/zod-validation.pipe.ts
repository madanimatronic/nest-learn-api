import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { ZodType } from 'zod';

// Не помечается @Injectable(), т.к. подразумевается
// создание инстанса этого класса с передачей схемы аргументом
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: any, metadata: ArgumentMetadata) {
    // TODO: дополнить/переопределить реализацию глобального
    // exception filter'а, чтобы обрабатывать ZodError
    const parsedValue = this.schema.parse(value);
    return parsedValue;
  }
}
