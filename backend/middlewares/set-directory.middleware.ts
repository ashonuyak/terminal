import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { CommandsService } from 'src/commands/commands.service';

@Injectable()
export class SetDirectoryMiddleware implements NestMiddleware {
  constructor(private readonly commandsService: CommandsService) {}

  async use(req: Request, _res: Response, next: Function) {
    const { location } = req.body;

    await this.commandsService.changeDirectory(location);

    next();
  }
}
