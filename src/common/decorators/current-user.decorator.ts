import {
  ContextType,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    if (ctx.getType() === 'http') {
      const request = ctx.switchToHttp().getRequest();
      return { ...request.user, userId: request.user.sub };
    }

    try {
      // Nếu là GraphQL context
      const gqlContext = GqlExecutionContext.create(ctx);
      return {
        ...gqlContext.getContext().req.user,
        userId: gqlContext.getContext().req.user.sub,
      };
    } catch {
      return null;
    }
  },
);
