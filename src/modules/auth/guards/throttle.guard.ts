import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  async canActivate(context: ExecutionContext) {
    console.log('🔍 [ThrottlerGuard] canActivate called');

    const result = await super.canActivate(context);

    console.log('🔍 [ThrottlerGuard] result:', result);
    return result;
  }
  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    throw new HttpException(
      'Too many login attempts. Please try again later.',
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
