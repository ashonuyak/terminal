import { Customization } from 'src/customization/schemas/customization.schema';
import { Column, Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import RolesEnum from '../enums/roles.enum';

@Entity('User')
export class User {
  @PrimaryColumn({ default: uuid(), unique: true })
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  password: string;

  @Column()
  role: RolesEnum;

  @OneToOne(() => Customization, (customization) => customization.user, { eager: true })
  @JoinColumn()
  customization: Customization;

  constructor(data?: Omit<User, 'id'>) {
    if (data) {
      (this.id = uuid()),
        (this.name = data.name),
        (this.password = data.password),
        (this.role = data.role),
        (this.customization = data.customization);
    }
  }
}
