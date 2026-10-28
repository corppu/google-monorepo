import type { GoogleHandlerContext } from '@gm/lib-express-google';

import { createAuthRouter, csrfGuard } from '@gm/lib-express-auth';
import { createGoogleRouter } from '@gm/lib-express-google';
import { createMapsController } from '@gm/lib-express-maps';
import { Router } from 'express';

export function createApiRouter(ctx: GoogleHandlerContext): Router {
  const router = Router();
  router.use(csrfGuard);
  router.use(createAuthRouter(ctx));
  router.use(createMapsController().router);
  router.use(createGoogleRouter(ctx));
  return router;
}
