import { Reflector } from '@nestjs/core';

export type Roles = 'user' | 'admin' | 'super-admin';
export const roles: Roles[] = ['user', 'admin', 'super-admin'];
export const userRole: Roles = 'user';

export const RolesDecorator = Reflector.createDecorator<Roles[]>();
