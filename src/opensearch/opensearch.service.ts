import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@opensearch-project/opensearch';

@Injectable()
export class OpensearchService extends Client implements OnModuleDestroy{
    private readonly logger = new Logger(OpensearchService.name);
    constructor(private readonly configService: ConfigService) {
        super({
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

    async onModuleDestroy() {
        await this.close();
        this.logger.log('Opensearch disconnected');
    }
}
