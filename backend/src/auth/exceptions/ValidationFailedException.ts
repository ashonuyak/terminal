import { HttpStatus, HttpException } from '@nestjs/common'

export class ValidationFailedException extends HttpException {
  constructor() {
    super('Validation failed', HttpStatus.UNPROCESSABLE_ENTITY)
  }
}
