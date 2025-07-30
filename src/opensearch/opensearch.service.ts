import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@opensearch-project/opensearch';
import { RequestBody } from '@opensearch-project/opensearch/lib/Transport';

@Injectable()
export class OpensearchService implements OnModuleDestroy{
    private readonly logger = new Logger(OpensearchService.name);
    private readonly osClient: Client;
    
    constructor(private readonly configService: ConfigService) {
        this.osClient = new Client({
            node: configService.getOrThrow('OPENSEARCH_NODE'),
            auth: {
                username: configService.getOrThrow('OPENSEARCH_USERNAME'),
                password: configService.getOrThrow('OPENSEARCH_PASSWORD'),
            },
            ssl: {
                rejectUnauthorized: false,
            },
        });
    }
    
    public async createIndex(args: {index: string, body: RequestBody}) {
        const { index, body } = args;
        const exists = await this.osClient.indices.exists({ index });
        if (exists.body) return { message: 'Index already exists' };
    
        return this.osClient.indices.create({
          index,
          body,
        });
      }
    
    public async insertDocument(args: {index: string, id: string, body: Record<string, any>}) {
        const { index, id, body } = args;
        return this.osClient.index({
          index,
          id,
          body,
          refresh: true,
        });
      }
    
    public async searchDocuments<T>(args: {index: string, body: RequestBody}): Promise<T> {
        const { index, body } = args;
        const response = await this.osClient.search({
          index,
          body,
        });
        return response.body.hits.hits as T;
      }
    
    public async updateDocument(args: {index: string, id: string, doc: Record<string, any>}) {
        const { index, id, doc } = args;
        return this.osClient.update({
          index,
          id,
          body: {
            doc,
          },
          refresh: true,
        });
      }
    
    public async deleteDocument(args: {index: string, id: string}) {
        const { index, id } = args;
        const response = await this.osClient.delete({
            index,
            id,
            refresh: true,
        });
        return response.body;
    }
    
    async onModuleDestroy() {
        await this.osClient.close();
        this.logger.log('Opensearch disconnected');
    }
}
