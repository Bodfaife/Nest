import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({ ttl: 60, limit: 20 }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const useSqlite = config.get('DB_USE_SQLITE') === 'true' || !config.get('DB_HOST');
        if (useSqlite) {
          return {
            type: 'sqlite',
            database: config.get('SQLITE_DB_PATH', 'data/nest_dev.sqlite'),
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
          };
        }

        return {
          type: 'postgres',
          host: config.get('DB_HOST', 'localhost'),
          port: parseInt(config.get('DB_PORT', '5432'), 10),
          username: config.get('DB_USER', 'postgres'),
          password: config.get('DB_PASSWORD', ''),
          database: config.get('DB_NAME', 'nest'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: config.get('TYPEORM_SYNCHRONIZE', 'true') === 'true',
          logging: false,
        };
      },
    }),
    AuthModule,
    UsersModule,
    TransactionsModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
