import { Injectable, ValidationPipe } from '@nestjs/common';

@Injectable()
export class NestValidationPipe extends ValidationPipe {
  loadValidator() {
    return require('@nestjs/class-validator');
  }

  loadTransformer() {
    return require('@nestjs/class-transformer');
  }
}
