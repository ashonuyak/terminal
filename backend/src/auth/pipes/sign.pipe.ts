import { Injectable, PipeTransform } from '@nestjs/common';
import { AuthDto } from 'src/dto';
import { ValidationFailedException } from '../exceptions';

@Injectable()
export class SignPipe implements PipeTransform {
  transform(value: AuthDto.Sign): AuthDto.Sign {
    if (!value.name || !value.password) throw new ValidationFailedException();
    return value;
  }
}
