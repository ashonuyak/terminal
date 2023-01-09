import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto, UserDto } from 'src/dto';
import { AuthService } from './auth.service';
import { NotFoundError, ValidationFailedError, WrongCredentialsError } from './errors';
import {
  NotFoundException,
  ValidationFailedException,
  WrongCredentialsException,
} from './exceptions';
import { SignPipe } from './pipes/sign.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body(SignPipe) dto: AuthDto.Sign): Promise<UserDto.User> {
    try {
      const response = await this.authService.signUp(dto);
      return response;
    } catch (err) {
      if (err instanceof ValidationFailedError) throw new ValidationFailedException();
      throw err;
    }
  }

  @Post('signin')
  async signIn(@Body(SignPipe) dto: AuthDto.Sign): Promise<any> {
    try {
      const tokens = await this.authService.signIn(dto);
      return tokens;
    } catch (err) {
      if (err instanceof NotFoundError) throw new NotFoundException();
      if (err instanceof WrongCredentialsError) throw new WrongCredentialsException();
      throw err;
    }
  }

  // @Get('logout/:all')
  // @UseGuards(AuthGuard)
  // logOut(@Param() param: { all: string }, @Headers() headers: { authorization: string }): void {
  //   this.service.logOut(param.all, headers.authorization.split(' ')[1]);
  // }
}
