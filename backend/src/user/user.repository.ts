import { Repository } from 'src/utils';
import { User } from './schemas/user.schema';

export class UserRepository extends Repository<User>(User) {}
