import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../entities/user.entity';


@ObjectType()
export class UserWrapper {
  @Field(() => User)
  user: User;
}
