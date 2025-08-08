import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PageAuditDto } from './dto/page-audit.dto';
import { AuditService } from './audit.service';

@ApiTags('audit')
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('pagination')
  pagination(@Query() query: PageAuditDto) {
    return this.auditService.pagination(query);
  }
} 
