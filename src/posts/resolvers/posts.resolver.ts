import { Resolver } from '@nestjs/graphql';
import { PostsService } from '../services/posts.service';

@Resolver()
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}
}
