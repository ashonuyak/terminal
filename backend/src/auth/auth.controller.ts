import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto, UserDto } from 'src/dto';
import { User } from 'src/user/schemas/user.schema';
import { AuthService } from './auth.service';
import { NotFoundError, WrongCredentialsError } from './errors';
import { NotFoundException, WrongCredentialsException } from './exceptions';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() dto: AuthDto.Sign): Promise<UserDto.User> {
    try {
      const response = await this.authService.signUp(dto);
      return response;
    } catch (err) {
      throw err;
    }
  }

  @Post('sign-in')
  async signIn(@Body() dto: AuthDto.Sign): Promise<User> {
    try {
      const user = await this.authService.signIn(dto);
      return user;
    } catch (err) {
      if (err instanceof NotFoundError) throw new NotFoundException();
      if (err instanceof WrongCredentialsError) throw new WrongCredentialsException();
      throw err;
    }
  }
}
