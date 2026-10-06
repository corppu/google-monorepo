import type { Request, Response } from 'express';
import { googleServicesFor } from './googleServices';
import type { GoogleHandlerContext } from './context';

export const publicContactInfoHandler =
  (ctx: GoogleHandlerContext) => async (req: Request, res: Response) => {
    try {
      res.json(
        await googleServicesFor(
          ctx,
          req,
          (res.locals as any).sid,
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
