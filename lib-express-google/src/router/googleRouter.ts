import { Router } from 'express';
import { requireSession } from '../handlers/context';
import type { GoogleHandlerContext } from '../handlers/context';
import { listScopesHandler } from '../handlers/scopesHandler';
import { listCalendarsHandler } from '../handlers/calendarHandlers';
import {
  createEventHandler,
  listEventsHandler,
  updateEventHandler,
} from '../handlers/eventHandlers';
import { listGroupsHandler } from '../handlers/groupHandlers';
import { userinfoHandler } from '../handlers/userinfoHandlers';
import { publicContactInfoHandler } from '../handlers/publicContactInfoHandler';

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
