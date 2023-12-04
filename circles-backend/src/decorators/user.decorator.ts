import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().user;
  },
);
