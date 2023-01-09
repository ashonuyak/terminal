import { Controller, Post, Body } from '@nestjs/common';
import { CommandsService } from './commands.service';

import { Command } from 'decorators/default-command-handler.decorator';
import ChangeDirectoryBody from 'src/commands/interfaces/change-directory-body.interface';

@Controller('commands')
export class CommandsController {
  constructor(private readonly commandsService: CommandsService) {}

  @Post()
  defaultHandler(@Command() command: string) {
    return this.commandsService.defaultHandler(command);
  }

  @Post('cd')
  changeDirectory(@Body() body: ChangeDirectoryBody) {
    return this.commandsService.changeDirectory(body.destination);
  }
}
