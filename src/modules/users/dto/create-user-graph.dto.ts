import { InputType, Field, ID } from '@nestjs/graphql';
import { MinLength, IsEmail, IsString, IsOptional } from 'class-validator';

@InputType()
export class CreateUserGraphDto {
  @Field()
  @MinLength(3)
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(6)
  password: string;

  @Field()
  @IsOptional()
  @IsString()
  role?: string;
}
