import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('AccessToken')
export class AccessTokenDto {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;
}
