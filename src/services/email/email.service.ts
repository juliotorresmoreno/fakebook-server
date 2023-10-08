import { Injectable } from '@nestjs/common';
import { EmailArgs, EmailProvider } from './provider';
import { ResendProvider } from './resend.provider';
import { Configuration } from 'src/config/configuration';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService implements EmailProvider {
  provider: EmailProvider;

  constructor(private config: ConfigService<Configuration>) {
    if (config.get('email').provider === 'resend' && config.get('resend')) {
      this.provider = new ResendProvider(config);
    }
  }

  send(args: EmailArgs) {
    if (!this.provider) throw new Error('Email provider not found');
    return this.provider.send(args);
  }
}
