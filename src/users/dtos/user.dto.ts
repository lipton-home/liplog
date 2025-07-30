import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '@prisma/client';

@ObjectType('User')
export class UserDto implements User {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  name: string;

  githubId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  deletedAt: Date | null;
}
