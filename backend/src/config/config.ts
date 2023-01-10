import { Customization } from 'src/customization/schemas/customization.schema';
import { User } from 'src/user/schemas/user.schema';

export const config = () => ({
  api: {
    origin: process.env.API_ORIGIN,
  },
  typeorm: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false,
    entities: [User, Customization],
  },
  bcrypt: {
    salt_rounds: {
      format: Number,
      default: 10,
      env: 'BCRYPT_SALT_ROUNDS',
    },
  },
});
