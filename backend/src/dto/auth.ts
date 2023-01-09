import RolesEnum from 'src/user/enums/roles.enum';

export interface Sign {
  name: string;
  password: string;
  role: RolesEnum;
}
