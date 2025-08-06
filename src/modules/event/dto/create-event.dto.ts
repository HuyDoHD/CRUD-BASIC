import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({
    example: 'Event Name',
    required: true,
    description: 'Event name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 10,
    required: true,
    description: 'Event max quantity',
  })
  @IsNumber()
  maxQuantity: number;
}
