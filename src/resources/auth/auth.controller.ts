import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { JoiValidationPipe } from 'src/pipes/joiValidation.pipe';
import { AuthService } from './auth.service';
import {
  SignInDto,
  SignInDtoResponse,
  SignInDtoSchema,
} from './dto/sign-in.dto';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
} from '@nestjs/swagger';
import {
  SignUpDto,
  SignUpDtoResponse,
  SignUpDtoSchema,
} from './dto/sign-up.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @UsePipes(new JoiValidationPipe(SignUpDtoSchema))
  @ApiHeader({
    name: 'content-type',
    enum: ['application/json'],
    allowEmptyValue: false,
    required: true,
    example: 'application/json',
  })
  @ApiCreatedResponse({
    description: 'Created',
    type: SignUpDtoResponse,
  })
  @ApiBody({
    required: true,
    type: SignUpDto,
  })
  signUp(@Body() payload: SignUpDto) {
    return this.authService.signUp(payload);
  }

  @Post('sign-in')
  @UsePipes(new JoiValidationPipe(SignInDtoSchema))
  @ApiHeader({
    name: 'content-type',
    enum: ['application/json'],
    allowEmptyValue: false,
    required: true,
    example: 'application/json',
  })
  @ApiCreatedResponse({
    description: 'Created',
    type: SignInDtoResponse,
  })
  signIn(@Body() createAuthDto: SignInDto) {
    return this.authService.signIn(createAuthDto);
  }
}
