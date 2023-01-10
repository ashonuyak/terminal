import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';

import { BcryptService } from 'src/bcrypt';
import { CustomizationService } from 'src/customization/customization.service';
import { AuthDto, UserDto } from 'src/dto';
import { UserService } from 'src/user';
import { User } from 'src/user/schemas/user.schema';
import { WrongCredentialsError } from './errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly userService: UserService,
    private readonly customizationService: CustomizationService
  ) {}

  async signUp(dto: AuthDto.Sign): Promise<UserDto.User> {
    const passwordHash = await this.bcryptService.hash(dto.password);

    const customization = await this.customizationService.createDefault();

    return this.userService.create({
      name: dto.name,
      password: passwordHash,
      role: dto.role,
      customization,
    });
  }

  async signIn(dto: AuthDto.Sign): Promise<User> {
    try {
      const user = await this.userService.get(dto.name);

      const isValidPass = await this.bcryptService.compare(dto.password, user.password);
      if (!isValidPass) throw new WrongCredentialsError();

      return user;
    } catch (e) {
      throw new BadRequestException('Invalid credentials');
    }
  }
}
