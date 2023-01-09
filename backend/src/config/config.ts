export const config = () => ({
  api: {
    origin: process.env.API_ORIGIN,
  },
  // typeorm: {
  //   type: process.env.DB_TYPE,
  //   host: process.env.DB_HOST,
  //   port: Number(process.env.DB_PORT),
  //   username: process.env.DB_USERNAME,
  //   password: process.env.DB_PASSWORD,
  //   database: process.env.DB_NAME,
  //   logging: false,
  //   entities: [User, Tokens],
  // },
  jwt: {
    secret: {
      format: String,
      default: 'secret',
      env: 'JWT_SECRET',
    },
    refresh_secret: {
      format: String,
      default: 'refresh_secret',
      env: 'JWT_SECRET_REFRESH',
    },
    access_ttl: {
      format: Number,
      default: 600,
      env: 'ACCESS_TTL',
    },
    refresh_ttl: {
      format: Number,
      default: 604800,
      env: 'REFRESH_TTL',
    },
  },
  bcrypt: {
    salt_rounds: {
      format: Number,
      default: 10,
      env: 'BCRYPT_SALT_ROUNDS',
    },
  },
});
