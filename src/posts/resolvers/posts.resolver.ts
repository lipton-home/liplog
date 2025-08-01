import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/global/decorators/current-user.decorator';
import { UserDto } from 'src/users/dtos/user.dto';
import { CreatePostDto } from '../dtos/create-post-input.dto';
import { PostDto } from '../dtos/post.dto';
import { UpdatePostDto } from '../dtos/update-post-input.dto';
import { PostsService } from '../services/posts.service';

@Resolver(() => PostDto)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(() => PostDto, { nullable: true })
  post(
    @Args('id', { type: () => ID }, ParseIntPipe) id: number,
  ): Promise<PostDto | null> {
    return this.postsService.findPostById({ id });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => PostDto)
  createPost(
    @Args('input') input: CreatePostDto,
    @CurrentUser() user: UserDto,
  ): Promise<PostDto> {
    return this.postsService.createPost({
      ...input,
      authorId: user.id,
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => PostDto)
  updatePost(
    @Args('id', { type: () => ID }, ParseIntPipe) id: number,
    @Args('input') input: UpdatePostDto,
    @CurrentUser() user: UserDto,
  ): Promise<PostDto> {
    return this.postsService.updatePost({
      ...input,
      id,
      authorId: user.id,
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => PostDto)
  deletePost(
    @Args('id', { type: () => ID }, ParseIntPipe) id: number,
    @CurrentUser() user: UserDto,
  ): Promise<PostDto> {
    return this.postsService.deletePost({ id, authorId: user.id });
  }
}
