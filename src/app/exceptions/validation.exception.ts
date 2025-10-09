import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationException extends BadRequestException {
  constructor(public validationErrors: ValidationError[]) {
    super({
      statusCode: 400,
      message: 'Validation failed',
      errors: ValidationException.formatErrors(validationErrors),
    });
  }

  private static formatErrors(errors: ValidationError[]) {
    return errors.reduce((acc, error) => {
      const constraints = error.constraints || {};
      acc[error.property] = Object.values(constraints);
      return acc;
    }, {});
  }
}

