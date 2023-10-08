import {
  Controller,
  Post,
  Body,
  UsePipes,
  Response,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { JoiValidationPipe } from 'src/pipes/joiValidation.pipe';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  SignInDto,
  SignInDtoResponse,
  SignInDtoSchema,
} from './dto/sign-in.dto';
import {
  SignUpDto,
  SignUpDtoResponse,
  SignUpDtoSchema,
} from './dto/sign-up.dto';
import express from 'express';
import { RolesDecorator } from 'src/roles';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { SessionDtoResponse } from './dto/session.dto';

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
  @RolesDecorator(['user', 'admin'])
  @UseGuards(RolesGuard)
  async session(
    @Request() req: express.Request,
    @Response() res: express.Response,
  ) {
    const session = (req as any).session;
    if (!session) {
      throw new UnauthorizedException();
    }

    res.cookie('accessToken', session.token, {
      expires: new Date(new Date().getTime() + 86400000 * 30),
      sameSite: 'strict',
      httpOnly: true,
    });

    res.json(session);
  }
}
