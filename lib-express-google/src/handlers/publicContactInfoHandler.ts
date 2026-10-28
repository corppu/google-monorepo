import type { Request, Response } from 'express';

import type { GoogleHandlerContext } from './context';

import { googleServicesFor } from './googleServices';

export const publicContactInfoHandler =
  (ctx: GoogleHandlerContext) => async (req: Request, res: Response) => {
    try {
      res.json(
        await (
          await googleServicesFor(ctx, req, (res.locals as any).sid)
        ).contactInfo.get(),
      );
    } catch (error) {
      res.status(502).json({
        error:
          error instanceof Error
            ? error.message
            : 'Unable to load public contact information.',
      });
    }
  };
