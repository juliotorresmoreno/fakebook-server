import {
  Controller,
  Post,
  Body,
  UsePipes,
  Response,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JoiValidationPipe } from 'src/pipes/joiValidation.pipe';
import { AuthService } from './auth.service';
import {
  SessionDtoResponse,
  SignInDto,
  SignInDtoResponse,
  SignInDtoSchema,
} from './dto/sign-in.dto';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  SignUpDto,
  SignUpDtoResponse,
  SignUpDtoSchema,
} from './dto/sign-up.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import express from 'express';

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
  async signIn(@Response() res, @Body() createAuthDto: SignInDto) {
    const session = await this.authService.signIn(createAuthDto);

    res.cookie('accessToken', session.token, {
      expires: new Date(new Date().getTime() + 86400000 * 30),
      sameSite: 'strict',
      httpOnly: true,
    });

    res.json(session);
  }

  @Get('session')
  @ApiOkResponse({
    description: 'OK',
    type: SessionDtoResponse,
  })
  @UseGuards(AuthGuard)
  async session(
    @Request() req: express.Request,
    @Response() res: express.Response,
  ) {
    const _session = (req as any).session;
    const user = await this.authService.findOne(_session.user.id);
    const session = await this.authService.session(user, _session.token);

    res.cookie('accessToken', session.token, {
      expires: new Date(new Date().getTime() + 86400000 * 30),
      sameSite: 'strict',
      httpOnly: true,
    });

    res.json(session);
  }
}
