import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
    constructor(private readonly prisma: PrismaService) {}
    
    async updateBlock(args:{
        id: number;
        content: string;
    }){
        
    }
}
