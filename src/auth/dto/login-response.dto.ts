import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserDTO {
  @Field()
  name: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field(() => [String])
  roles: string[];
}

@ObjectType()
export class LoginResponse {
  @Field()
  access_token: string;

  @Field()
  userId: string;
}
