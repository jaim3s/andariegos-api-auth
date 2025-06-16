// auth/dto/login-response.output.ts
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class RegisterResponse {
  @Field()
  access_token: string;
}
