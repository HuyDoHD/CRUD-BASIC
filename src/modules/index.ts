import { UserModule } from './users/user.module';
import { VoucherModule } from './voucher/voucher.module';
import { EventModule } from './event/event.module';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';

export const Modules = [UserModule, VoucherModule, EventModule, AuditModule, AuthModule];
