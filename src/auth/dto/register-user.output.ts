// register-user.output.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class RegisterUserOutput {
  @Field(() => ID)
  id: string;
}
