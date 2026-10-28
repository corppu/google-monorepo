import { Router } from 'express';

import type { GoogleHandlerContext } from '../handlers/context';

import { listCalendarsHandler } from '../handlers/calendarHandlers';
import { requireSession } from '../handlers/context';
import {
  createEventHandler,
  listEventsHandler,
  updateEventHandler,
} from '../handlers/eventHandlers';
import { listGroupsHandler } from '../handlers/groupHandlers';
import { publicContactInfoHandler } from '../handlers/publicContactInfoHandler';
import { listScopesHandler } from '../handlers/scopesHandler';
import { userinfoHandler } from '../handlers/userinfoHandlers';

/** Mounted under /api; serves /api/google/*. Login lives in `@gm/lib-express-auth` (/api/auth/*). */
export function createGoogleRouter(ctx: GoogleHandlerContext): Router {
  const router = Router();
  const authed = requireSession(ctx);
  router.get('/google/auth/scopes', listScopesHandler(ctx));
  router.get('/google/calendars', authed, listCalendarsHandler(ctx));
  router.get('/google/events', authed, listEventsHandler(ctx));
  router.post('/google/events', authed, createEventHandler(ctx));
  router.patch('/google/events/:eventId', authed, updateEventHandler(ctx));
  router.get('/google/groups', authed, listGroupsHandler(ctx));
  router.get('/google/userinfo', authed, userinfoHandler(ctx));
  router.get(
    '/google/public-contact-info',
    authed,
    publicContactInfoHandler(ctx),
  );
  return router;
}
