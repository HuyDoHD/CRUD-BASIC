import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class PageQueryDto {
    @ApiProperty({ example: 1, description: 'Trang hiện tại' })
    @Type(() => Number)
    @IsNumber()
    page: number;

    @ApiProperty({ example: 10, description: 'Số lượng phần tử trên mỗi trang' })
    @Type(() => Number)
    @IsNumber()
    limit: number;
}