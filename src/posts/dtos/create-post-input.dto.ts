import { Field, InputType, Int } from "@nestjs/graphql";

@InputType("CreatePostInput")
export class CreatePostDto {
    @Field(() => String)
    title: string;

    @Field(() => String, { nullable: true })
    description?: string;

    @Field(() => [String])
    tags: string[];

    @Field(() => Boolean)
    isPublic: boolean;

    @Field(() => Int, { nullable: true })
    thumbnailId?: number;
}