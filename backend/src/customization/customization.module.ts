import { Module } from '@nestjs/common';
import { CustomizationController } from './customization.controller';
import { CustomizationRepository } from './customization.repository';
import { CustomizationService } from './customization.service';

@Module({
  controllers: [CustomizationController],
  providers: [CustomizationRepository, CustomizationService],
  exports: [CustomizationService],
})
export class CustomizationModule {}
