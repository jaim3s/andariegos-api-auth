import { SetMetadata } from '@nestjs/common';
import { registerEnumType } from '@nestjs/graphql';

enum Role {
  USER = 'USER',
  ORGANIZER = 'ORGANIZER',
  ADMIN = 'ADMIN',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'Roles disponibles para los usuarios',
});

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
