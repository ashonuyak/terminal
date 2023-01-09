import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { SetDirectoryMiddleware } from 'middlewares/set-directory.middleware';
import { AuthModule } from './auth';
import { CommandsController } from './commands/commands.controller';
import { CommandsModule } from './commands/commands.module';
import { UserModule } from './user';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';

// import { config } from './config/config';
// import { DatabaseConfig } from './config/database.config';

@Module({
  imports: [
    CommandsModule,
    UserModule,
    AuthModule,
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   load: [config],
    // }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useClass: DatabaseConfig,
    // }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SetDirectoryMiddleware).forRoutes(CommandsController);
  }
}
