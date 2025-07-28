import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class PostDto {
    @Field(() => Int)
    id: number;

    @Field(() => String)
    title: string;
    
}