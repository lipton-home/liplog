import { InputType, PartialType } from '@nestjs/graphql';
import { CreatePostDto } from './create-post-input.dto';

@InputType('UpdatePostInput')
export class UpdatePostDto extends PartialType(CreatePostDto) {}
