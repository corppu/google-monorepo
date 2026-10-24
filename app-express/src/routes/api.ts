import { Router } from 'express';
import { createAuthRouter, csrfGuard } from '@gm/lib-express-auth';
import { createGoogleRouter } from '@gm/lib-express-google';
import type { GoogleHandlerContext } from '@gm/lib-express-google';

export function createApiRouter(ctx: GoogleHandlerContext): Router {
  const router = Router();
  router.use(csrfGuard);
  router.use(createAuthRouter(ctx));
  router.use(createGoogleRouter(ctx));
  return router;
}
