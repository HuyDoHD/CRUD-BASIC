import { Controller, Post, Param, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VoucherService } from './voucher.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import * as userPayloadInterface from 'src/common/interfaces/user-payload.interface';
import { PageQueryDto } from 'src/common/dto/page-query.dto';

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

  @Get('list')
  async paginatedList(@Query() query: PageQueryDto) {
    return this.voucherService.paginatedList(query.page, query.limit);
  }
}
