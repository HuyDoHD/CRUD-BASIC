import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { PageQueryDto } from 'src/common/dto/page-query.dto';

export class PageUserDto extends PageQueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Nguyen Van A', description: 'Tên người dùng' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'nguyenvana@gmail.com',
    description: 'Email người dùng',
  })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'user', description: 'Vai trò người dùng' })
  role?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'active', description: 'Trạng thái người dùng' })
  status?: string;
}
