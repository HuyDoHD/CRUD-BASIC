import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import type { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any) {
    // Kiểm tra nếu không có body (value undefined/null) hoặc không phải object
    if (!value || typeof value !== 'object') {
      throw new BadRequestException('Validation failed: request body must be a valid object');
    }

    const { error } = this.schema.validate(value, { abortEarly: false }); // show all errors
    if (error) {
      // Nối tất cả message lỗi lại thành 1 string
      const messages = error.details.map(d => d.message).join(', ');
      throw new BadRequestException(`Validation failed: ${messages}`);
    }
    return value;
  }
}
