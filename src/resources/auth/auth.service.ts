import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/sign-in.dto';
import { User } from 'src/entities/User.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async signIn(_payload: SignInDto) {
    console.log(await this.usersRepository.find());
    return 'This action adds a new auth';
  }

  async signUp(_payload: SignInDto) {
    return `This action returns all auth`;
  }
}
