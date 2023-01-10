import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import adminCommands from 'common/admin-commands';
import commands from 'common/commands';
import RolesEnum from 'src/user/enums/roles.enum';

export const Command = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const { body } = ctx.switchToHttp().getRequest();

  const command = body.command.split(' ')[0];

  if (
    body.role !== RolesEnum.ADMIN &&
    Object.keys(adminCommands).find((el) => adminCommands[el]?.includes(command))
  ) {
    throw new BadRequestException('Restricted command');
  }

  const args = body.command.split(' ').slice(1).join(' ');

  const existingCommand = Object.keys({ ...commands, ...adminCommands }).find((el) =>
    ({ ...commands, ...adminCommands }[el].includes(command))
  );

  if (!existingCommand) {
    throw new BadRequestException('Unsupported command');
  }

  return `${existingCommand} ${args}`;
});
