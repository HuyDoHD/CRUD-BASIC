import { Controller, Post, Param, Get, Query, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VoucherService } from './voucher.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import * as userPayloadInterface from 'src/common/interfaces/user-payload.interface';
import { PageVoucherDto } from './dto/page-voucher.dto';

@ApiTags('vouchers')
@Controller('vouchers')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post('issue/:eventId')
  async issueVoucher(
    @Param('eventId') eventId: string,
    @CurrentUser() user: userPayloadInterface.UserPayload,
  ) {
    return this.voucherService.issueVoucher(eventId, user);
  }

  @Get('')
  async findAll() {
    return this.voucherService.findAll();
  }

  @Get('pagination')
  async pagination(@Query() query: PageVoucherDto, @CurrentUser() user: userPayloadInterface.UserPayload) {
    return this.voucherService.pagination(query, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.voucherService.delete(id);
  }
}
