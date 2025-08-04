import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Nguyen Van A', description: 'Tên người dùng' })
  name: string;

  @IsEmail()
  @ApiProperty({ example: 'nguyenvana@gmail.com', description: 'Email người dùng' })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: '123456', description: 'Mật khẩu người dùng' })
  password: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'user', description: 'Vai trò người dùng' })
  role?: string;
}
