import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './resources/auth/auth.module';
import { CryptoService } from './services/crypto/crypto.service';
import configuration, {
  Configuration,
  validationSchema,
} from './config/configuration';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import type { RedisClientOptions } from 'redis';
import { EmailService } from './services/email/email.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: validationSchema,
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<Configuration>) => {
        const defaultUrl = 'redis://localhost:6379/0';
        return {
          store: redisStore,
          url: config.get('redis')?.url ?? defaultUrl,
          ttl: 86400000, // 1 day
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService<Configuration>) =>
        config.get('database'),
      inject: [ConfigService],
    }),

    AuthModule,
  ],
  controllers: [],
  providers: [CryptoService, EmailService],
  exports: [],
})
export class AppModule {}
