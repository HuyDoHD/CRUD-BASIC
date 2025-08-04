import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;

    const request = context.switchToHttp().getRequest();
    console.log('[JwtAuthGuard] Authenticated user:', request.user); // Bây giờ mới có user

    return result;
  }
}   
    