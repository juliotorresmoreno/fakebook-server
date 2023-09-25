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
  @ApiProperty({
    example: 'asas',
  })
  @JoiSchema(Joi.string().required())
  readonly username: string;

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
