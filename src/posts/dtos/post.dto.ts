import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Post, PostStatus } from '@prisma/client';

registerEnumType(PostStatus, {
  name: 'PostStatus',
  description: '포스트 상태',
});

@ObjectType('Post')
export class PostDto implements Post {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => String)
  content: string;

  @Field(() => Int)
  viewCount: number;

  @Field(() => Int)
  likeCount: number;

  @Field(() => [String])
  tags: string[];

  @Field(() => PostStatus)
  status: PostStatus;

  @Field(() => Boolean)
  isPublic: boolean;

  thumbnailId: number | null;

  @Field(() => Int)
  authorId: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  publishedAt: Date | null;

  deletedAt: Date | null;
}
