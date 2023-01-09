import { Injectable } from '@nestjs/common';

import { BcryptService } from 'src/bcrypt';
import { AuthDto, UserDto } from 'src/dto';
import { UserService } from 'src/user';
import { WrongCredentialsError } from './errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly userService: UserService
  ) {}

  async signUp(dto: AuthDto.Sign): Promise<UserDto.User> {
    const passwordHash = await this.bcryptService.hash(dto.password);

    console.log(passwordHash);

    return this.userService.create({
      name: dto.name,
      password: passwordHash,
      role: dto.role,
    });
  }

  async signIn(dto: AuthDto.Sign): Promise<any> {
    const user = await this.userService.get(dto.name);

    const isValidPass = await this.bcryptService.compare(dto.password, user.password);
    if (!isValidPass) throw new WrongCredentialsError();

    // return this.customizationService.get(user.id);
  }

  // logOut(all: string, accessToken: string): void {
  //   return this.tokensServiceProxy.disableTokens(accessToken, all);
  // }
}
