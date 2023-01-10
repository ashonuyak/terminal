import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { UserDto } from 'src/dto';
import { UserNotFoundError } from './errors';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getInfo(@Query('name') name: string): Promise<UserDto.GetUser> {
    try {
      const user = await this.userService.get(name);

      return { name: user.name, customization: user.customization, role: user.role };
    } catch (err) {
      if (err instanceof UserNotFoundError) throw new HttpException('User does not exist', 400);
      throw err;
    }
  }
}
