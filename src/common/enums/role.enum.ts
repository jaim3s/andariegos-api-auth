import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  USER = 'USER',
  ORGANIZER = 'ORGANIZER',
  ADMIN = 'ADMIN',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'Roles disponibles para los usuarios',
});