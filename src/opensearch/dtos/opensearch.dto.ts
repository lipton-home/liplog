export interface BaseDataSetDto<T> {
  indexName: string;
  data: T[];
}

export class DataSetDto<T extends { id: number | bigint | string }>
  implements BaseDataSetDto<T>
{
  indexName: string;
  data: T[];
}

export class DeleteOperationDto {
  indexName: string;
  id?: string;
}
