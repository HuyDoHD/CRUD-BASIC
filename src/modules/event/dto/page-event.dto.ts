import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { PageQueryDto } from 'src/common/dto/page-query.dto';

export class PageEventDto extends PageQueryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxQuantity?: number;
}
