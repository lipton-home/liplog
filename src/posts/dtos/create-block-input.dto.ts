import { Field, InputType } from "@nestjs/graphql";
import { BlockType } from "@prisma/client";

@InputType("CreateBlockInput")
export class CreateBlockDto {
    @Field(() => BlockType)
    type: BlockType;

    @Field(() => String)
    content: string;

    @Field(() => String, { nullable: true })
    metadata?: string | null;
}