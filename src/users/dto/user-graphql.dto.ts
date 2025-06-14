// src/users/dto/user-graphql.dto.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserGraphQL {
  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  registrationDate: Date;

  @Field()
  state: string;

  @Field(() => [String])
  roles: string[];
}
