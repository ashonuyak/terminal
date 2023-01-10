import { User } from 'src/user/schemas/user.schema';
import { Column, Entity, PrimaryColumn, OneToOne } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('Customization')
export class Customization {
  @PrimaryColumn({ default: uuid(), unique: true })
  id: string;

  @Column()
  textColor: string;

  @Column()
  backgroundColor: string;

  @OneToOne(() => User, (user) => user.customization)
  user: User;

  constructor(data?: any) {
    if (data) {
      (this.id = uuid()),
        (this.textColor = data.textColor),
        (this.backgroundColor = data.backgroundColor),
        (this.user = data.user);
    }
  }
}
