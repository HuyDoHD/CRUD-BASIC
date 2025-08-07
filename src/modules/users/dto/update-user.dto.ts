import { CreateUserDto } from './create-user.dto';
import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @MinLength(6)
  @ApiProperty({ example: '123456', description: 'Mật khẩu mới' })
  newPassword?: string;
}
