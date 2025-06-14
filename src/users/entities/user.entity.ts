import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class User {

  @Field()
  name: string;

   @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;

  @Field(() => [String])
  roles: string[];

  @Field()
  registrationDate: Date;

  @Field()
  state: string;
}
