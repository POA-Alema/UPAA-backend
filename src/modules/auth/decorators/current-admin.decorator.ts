import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedAdmin } from '../types/authenticated-admin';

type RequestWithAdmin = Request & {
  user?: AuthenticatedAdmin;
};

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedAdmin => {
    const request = ctx.switchToHttp().getRequest<RequestWithAdmin>();

    return request.user as AuthenticatedAdmin;
  },
);
