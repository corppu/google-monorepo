import type { Request, Response } from 'express';

import { GOOGLE_SCOPES } from '@gm/lib-common-google';

import type { GoogleHandlerContext } from './context';

export const listScopesHandler =
  (_ctx: GoogleHandlerContext) => (_req: Request, res: Response) => {
    res.json({ scopes: GOOGLE_SCOPES });
  };
