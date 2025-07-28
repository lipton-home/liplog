import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostDto } from '../dtos/post.dto';

@Injectable()
export class PostsService {
    constructor(private readonly prisma: PrismaService) {}
    
    async createPost(args:{
        title: string;
        description?: string;
        tags: string[];
        isPublic: boolean;
        thumbnailId: number;
        authorId: number;
    }): Promise<PostDto>{
        const {title, description, tags, isPublic, thumbnailId, authorId} = args;

        return this.prisma.post.create({
            data: {
                title,
                description,
                tags,
                isPublic,
                thumbnailId,
                authorId,
            },
        });
    }
}
