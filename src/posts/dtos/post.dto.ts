import { Field, InputType, Int } from "@nestjs/graphql";
import { PostStatus } from "@prisma/client";

@InputType()
export class PostDto {
    @Field(() => Int)
    id: number;

    @Field(() => String)
    title: string;

    @Field(() => String, { nullable: true })
    description?: string | null;

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

    thumbnailId: number;
    
    authorId: number;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field(() => Date, { nullable: true })
    publishedAt?: Date | null;
}