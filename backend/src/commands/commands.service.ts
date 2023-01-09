import { Injectable } from '@nestjs/common';
import { execSync } from 'child_process';

@Injectable()
export class CommandsService {
  defaultHandler(command: string) {
    try {
      return execSync(command).toString();
    } catch (e) {
      console.error(e);

      return e.stderr.toString();
    }
  }

  changeDirectory(directory: string) {
    try {
      process.chdir(directory);

      return process.cwd();
    } catch (e) {
      console.error(e);

      return e.stderr.toString();
    }
  }
}
