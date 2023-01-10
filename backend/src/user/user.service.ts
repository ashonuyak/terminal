import { Injectable } from '@nestjs/common';
import { AuthDto, UserDto } from 'src/dto';
import { UserNotFoundError } from './errors';
import { User } from './schemas/user.schema';

import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(dto: AuthDto.Sign): Promise<User> {
    try {
      const user = new User(dto);
      return this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async get(name: string): Promise<User> {
    const user = await this.userRepository.findOne({ name });

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }
}
