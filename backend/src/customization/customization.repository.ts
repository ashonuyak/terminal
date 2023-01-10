import { Repository } from 'src/utils';
import { Customization } from './schemas/customization.schema';

export class CustomizationRepository extends Repository<Customization>(Customization) {}
