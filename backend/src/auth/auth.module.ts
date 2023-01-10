import { Module } from '@nestjs/common';
import { BcryptModule } from 'src/bcrypt';
import { CustomizationModule } from 'src/customization/customization.module';
import { UserModule } from 'src/user';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, BcryptModule, CustomizationModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
