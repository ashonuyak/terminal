import { Controller, Post, Body } from '@nestjs/common';
import { CustomizationDto } from 'src/dto';
import { CustomizationService } from './customization.service';

@Controller('customization')
export class CustomizationController {
  constructor(private readonly customizationService: CustomizationService) {}

  @Post()
  async create(@Body() dto: CustomizationDto.CreateCustomization) {
    return this.customizationService.create(dto);
  }

  @Post('update')
  async update(@Body() dto: CustomizationDto.UpdateCustomization) {
    return this.customizationService.update(dto);
  }
}
