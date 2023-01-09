import { HttpStatus, HttpException } from '@nestjs/common'

export class WrongCredentialsException extends HttpException {
  constructor() {
    super('The user with the requested credentials does not exist', HttpStatus.NOT_FOUND)
  }
}
