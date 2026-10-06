import type { Request, Response } from 'express';
import { GOOGLE_SCOPES } from '@gm/lib-common-google';
import type { GoogleHandlerContext } from './context';

export const scopesHandler =
  (ctx: GoogleHandlerContext) => (req: Request, res: Response) => {
    const scopes = Array.isArray(req.body?.scopes)
      ? req.body.scopes.filter((s: unknown) => typeof s === 'string')
      : [];
    res.json({ scopes: ctx.auth.setScopes((res.locals as any).sid, scopes) });
  };

export const listScopesHandler =
  (_ctx: GoogleHandlerContext) => (_req: Request, res: Response) => {
    res.json({ scopes: GOOGLE_SCOPES });
  };
