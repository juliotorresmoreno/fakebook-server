import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/User.entity';
import { CryptoService } from 'src/services/crypto/crypto.service';
import { EmailService } from 'src/services/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, CryptoService, EmailService],
  exports: [AuthService],
})
export class AuthModule {}
