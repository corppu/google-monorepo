import { Router } from 'express';
import { createGoogleRouter } from '@gm/lib-express-google';
import type { GoogleHandlerContext } from '@gm/lib-express-google';

export function createApiRouter(ctx: GoogleHandlerContext): Router {
  const router = Router();
  router.use(createGoogleRouter(ctx));
  return router;
}
