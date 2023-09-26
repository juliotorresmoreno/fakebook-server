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
export class SignUpDto {
  @ApiProperty()
  @JoiSchema(Joi.string().required())
  readonly email: string;

  @ApiProperty()
  @JoiSchema(Joi.string().required())
  readonly firstname: string;

  @ApiProperty()
  @JoiSchema(Joi.string().required())
  readonly lastname: string;

  @ApiProperty()
  @JoiSchema(Joi.string().required())
  readonly password: string;
}
export const SignUpDtoSchema = getClassSchema(SignUpDto);

export class SignUpDtoResponse {
  @ApiProperty()
  @JoiSchema(Joi.string().required())
  readonly token: string;
}
