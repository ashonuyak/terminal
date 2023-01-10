import { Customization } from 'src/customization/schemas/customization.schema';
import RolesEnum from 'src/user/enums/roles.enum';

export type GetUser = Omit<User, 'password' | 'id'>;

export interface User {
  id: string;
  name: string;
  password: string;
  role: RolesEnum;
  customization: Customization;
}
