import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { PageQueryDto } from 'src/common/dto/page-query.dto';

export class PageAuditDto extends PageQueryDto {
  @IsString()
  @IsOptional()
  action?: string;

  @IsString()
  @IsOptional()
  collectionName?: string;

  @IsString()
  @IsOptional()
  performedBy?: string;

  @IsString()
  @IsOptional()
  changedFields?: string;

  @IsString()
  @IsOptional()
  createdAt?: string;
}
