import { Injectable } from '@nestjs/common';
import { CustomizationDto } from 'src/dto';
import { CustomizationRepository } from './customization.repository';
import { Customization } from './schemas/customization.schema';

@Injectable()
export class CustomizationService {
  constructor(private readonly customizationRepository: CustomizationRepository) {}

  async create(dto: CustomizationDto.CreateCustomization): Promise<Customization> {
    try {
      const customization = new Customization(dto);
      return this.customizationRepository.save(customization);
    } catch (error) {
      throw error;
    }
  }

  async createDefault(): Promise<Customization> {
    const customization = new Customization({ textColor: 'white', backgroundColor: 'navy' });
    return this.customizationRepository.save(customization);
  }

  async update(dto: CustomizationDto.UpdateCustomization): Promise<void> {
    return this.customizationRepository.updateOne({ id: dto.id }, dto);
  }
}
