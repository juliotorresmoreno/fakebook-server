import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../config/configuration';

@Injectable()
export class CryptoService {
  private iterations = 2000;
  private secret: string;
  private keyLen = 512;
  private digest = 'sha512';

  constructor(private configService: ConfigService<Configuration>) {
    this.secret = configService.get('secret');
  }

  public encode(pwd: string, keyLen: number = this.keyLen): string {
    const hash = crypto.pbkdf2Sync(
      pwd,
      this.secret,
      this.iterations,
      keyLen,
      this.digest,
    );
    return hash.toString('base64');
  }

  validate(pwd: string, hash: string) {
    return this.encode(pwd) === hash;
  }

  generateString(length: number): string {
    return crypto
      .randomBytes(length / 2 + 1)
      .toString('hex')
      .substring(0, length);
  }
}
