import { registerEnumType } from '@nestjs/graphql';

export enum UserState {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

registerEnumType(UserState, {
  name: 'UserState',
  description: 'Estado del usuario',
});