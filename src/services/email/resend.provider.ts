import { ConfigService } from '@nestjs/config';
import { EmailArgs, EmailProvider } from './provider';
import { Resend } from 'resend';
import { Configuration } from 'src/config/configuration';

export class ResendProvider implements EmailProvider {
  private resend: Resend;

  constructor(private config: ConfigService<Configuration>) {
    this.resend = new Resend(config.get('resend').ApiKey);
  }

  send(args: EmailArgs) {
    this.resend.emails.send({
      from: args.from || '',
      to: args.to,
      subject: args.subject,
      html: args.html,
    });
  }
}
