import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@opensearch-project/opensearch';
import { SearchHit } from '@opensearch-project/opensearch/api/types';
import { RequestBody } from '@opensearch-project/opensearch/lib/Transport';
import { DataSetDto } from './dtos/opensearch.dto';

@Injectable()
export class OpensearchService implements OnModuleDestroy {
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

  async bulkDataIngestion<T extends { id: number | bigint | string }>(
    input: DataSetDto<T>,
  ): Promise<any> {
    const body = input.data.flatMap((doc) => {
      return [{ index: { _index: input.indexName, _id: doc.id } }, doc];
    });

    try {
      const res = await this.osClient.bulk({ body });
      return res.body;
    } catch (err) {
      this.logger.error(`Exception occurred : ${err})`);
    }
  }

  async singleDataIngestion<T extends { id: number | bigint | string }>(
    input: DataSetDto<T>,
  ): Promise<any> {
    const character = input.data[0];

    try {
      const res = await this.osClient.index({
        id: character.id.toString(),
        index: input.indexName,
        body: {
          ...character,
        },
      });
      return res.body;
    } catch (err) {
      this.logger.error(`Exception occurred : ${err})`);
    }
  }

  public async createIndex(args: { index: string; body: RequestBody }) {
    const { index, body } = args;
    const exists = await this.osClient.indices.exists({ index });
    if (exists.body) return { message: 'Index already exists' };

    return this.osClient.indices.create({
      index,
      body,
    });
  }

  public async insertDocument(args: {
    index: string;
    id: string;
    body: Record<string, any>;
  }) {
    const { index, id, body } = args;
    return this.osClient.index({
      index,
      id,
      body,
      refresh: true,
    });
  }

  public async searchDocuments<T>(args: {
    indexName: string;
    body: RequestBody;
  }): Promise<T> {
    const { indexName, body } = args;
    const response = await this.osClient.search({
      index: indexName,
      body,
    });
    return response.body.hits as T;
  }

  async searchByKeyword<T extends { id: number | bigint | string }>(
    indexName: string,
    keyword: string,
    fields?: string[],
  ): Promise<SearchHit<T>[]> {
    const body: RequestBody = {
      query: {
        multi_match: {
          query: keyword,
          fields: fields || ['*'],
          type: 'best_fields',
        },
      },
    };

    try {
      const res = await this.osClient.search({
        index: indexName,
        body,
      });

      if (res.body.hits.total.value === 0) {
        this.logger.debug(
          `No results found for keyword: ${keyword} in index: ${indexName}`,
        );
        return [];
      }

      this.logger.debug(
        `Found ${res.body.hits.hits.length} results for keyword: ${keyword}`,
      );
      return res.body.hits.hits as SearchHit<T>[];
    } catch (error) {
      this.logger.error(
        `Exception occurred while searching for keyword "${keyword}" in index "${indexName}": ${error}`,
      );
      return [];
    }
  }

  public async updateDocument<T extends Record<string, any>>(args: {
    indexName: string;
    id: string;
    doc: T;
  }): Promise<any> {
    const { indexName, id, doc } = args;

    try {
      const response = await this.osClient.update({
        index: indexName,
        id,
        body: {
          doc,
        },
        refresh: true,
      });

      return response.body;
    } catch (error) {
      this.logger.error(
        `Exception occurred while updating document "${id}" in index "${indexName}": ${error}`,
      );
      throw new Error(`Failed to update document: ${error.message}`);
    }
  }

  public async deleteDocument(args: {
    indexName: string;
    id: string;
  }): Promise<any> {
    const { indexName, id } = args;

    try {
      const response = await this.osClient.delete({
        index: indexName,
        id,
        refresh: true,
      });

      return response.body;
    } catch (error) {
      this.logger.error(
        `Exception occurred while deleting document "${id}" from index "${indexName}": ${error}`,
      );
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  }

  async onModuleDestroy() {
    await this.osClient.close();
    this.logger.log('Opensearch disconnected');
  }
}
