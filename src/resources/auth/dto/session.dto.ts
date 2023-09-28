import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

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
  readonly user: any;
}
