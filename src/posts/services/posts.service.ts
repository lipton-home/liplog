import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostDto } from '../dtos/post.dto';
import { OpensearchService } from 'src/opensearch/opensearch.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly opensearchService: OpensearchService,
  ) {}

  public async findPostById(args: { id: number }): Promise<PostDto | null> {
    const { id } = args;
    return this.prisma.post.findUnique({ where: { id } });
  }

  public async createPost(args: {
    title: string;
    description: string | null;
    content: string;
    tags: string[];
    isPublic: boolean;
    thumbnailId: number | null;
    authorId: number;
  }): Promise<PostDto> {
    const {
      title,
      description,
      content,
      tags,
      isPublic,
      thumbnailId,
      authorId,
    } = args;

    const post = await this.prisma.post.create({
      data: {
        title,
        description,
        content,
        tags,
        isPublic,
        thumbnailId,
        authorId,
      },
    });

    await this.opensearchService.singleDataIngestion({
      indexName: 'posts',
      data: [post],
    });

    return post;
  }

  public async updatePost(args: {
    id: number;
    title?: string;
    description?: string | null;
    content?: string;
    tags?: string[];
    isPublic?: boolean;
    thumbnailId?: number | null;
    authorId: number;
  }): Promise<PostDto> {
    const { id, title, description, content, tags, isPublic, thumbnailId } =
      args;

    const post = await this.prisma.post.update({
      where: { id },
      data: { title, description, content, tags, isPublic, thumbnailId },
    });

    await this.opensearchService.singleDataIngestion({
      indexName: 'posts',
      data: [post],
    });

    return post;
  }

  public async deletePost(args: {
    id: number;
    authorId: number;
  }): Promise<PostDto> {
    const { id, authorId } = args;
    const post = await this.prisma.post.update({
      where: { id, authorId },
      data: { deletedAt: new Date() },
    });

    await this.opensearchService.deleteDocument({
      indexName: 'posts',
      id: post.id.toString(),
    });

    return post;
  }
}
