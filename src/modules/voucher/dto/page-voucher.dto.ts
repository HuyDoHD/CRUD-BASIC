import { PageQueryDto } from 'src/common/dto/page-query.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PageVoucherDto extends PageQueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Tên sự kiện',
    required: false,
  })
  eventName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Mã voucher',
    required: false,
  })
  code?: string;
}
