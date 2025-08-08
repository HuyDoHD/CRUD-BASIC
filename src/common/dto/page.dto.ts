import { ApiProperty } from '@nestjs/swagger';

export class PageMetaDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  constructor({
    total,
    page,
    limit,
  }: {
    total: number;
    page: number;
    limit: number;
  }) {
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}

export class PageDto<T> {
  data: T[];
  meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
