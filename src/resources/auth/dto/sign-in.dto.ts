import {
  JoiSchema,
  JoiSchemaOptions,
  getClassSchema,
} from 'joi-class-decorators';
import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class SignInDto {
  @ApiProperty()
  @JoiSchema(Joi.string().required())
  readonly email: string;

  @ApiProperty()
  @JoiSchema(Joi.string().required())
  readonly password: string;
}
export const SignInDtoSchema = getClassSchema(SignInDto);

export class SignInDtoResponse {
  @ApiProperty()
  @JoiSchema(Joi.string().required())
  readonly token: string;
}

export class SessionDtoResponse {
  @ApiProperty()
  @JoiSchema(Joi.string().required())
  readonly token: string;

  @ApiProperty()
  @JoiSchema(
    Joi.object({
      id: Joi.number().required(),
      email: Joi.string().required(),
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      isActive: Joi.boolean().required(),
    }).required(),
  )
  readonly session: string;
}
