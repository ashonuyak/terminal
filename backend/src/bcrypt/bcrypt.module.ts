import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BcryptService } from './bcrypt.service';

@Module({
  providers: [BcryptService, ConfigService],
  exports: [BcryptService],
})
export class BcryptModule {}
