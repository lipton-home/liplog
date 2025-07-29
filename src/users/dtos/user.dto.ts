import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '@prisma/client';

@ObjectType('User')
export class UserDto implements User {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  githubId: string;
  createdAt: Date;
  updatedAt: Date;
}
