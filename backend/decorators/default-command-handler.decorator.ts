import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import commands from 'common/commands';

export const Command = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const { body } = ctx.switchToHttp().getRequest();

  const command = body.command.split(' ')[0];

  const args = body.command.split(' ').slice(1).join(' ');

  const existingCommand = Object.keys(commands).find((el) => commands[el].includes(command));

  if (!existingCommand) {
    throw new BadRequestException();
  }

  return `${existingCommand} ${args}`;
});
