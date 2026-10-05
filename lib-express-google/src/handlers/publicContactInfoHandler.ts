import type { Request, Response } from 'express';
import { GooglePublicContactInfoService } from '@gm/lib-rest-google';
import type { GoogleHandlerContext } from './context';

export const publicContactInfoHandler =
  (ctx: GoogleHandlerContext) => async (_req: Request, res: Response) => {
    try {
      res.json(
        await new GooglePublicContactInfoService(
          ctx.auth.authorizedClient((res.locals as any).sid),
        ).get(),
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
