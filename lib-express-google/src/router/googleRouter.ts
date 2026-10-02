import { Router } from 'express';
import { requireSession } from '../handlers/context';
import type { GoogleHandlerContext } from '../handlers/context';
import { loginHandler } from '../handlers/loginHandler';
import { scopesHandler, listScopesHandler } from '../handlers/scopesHandler';
import { startHandler } from '../handlers/startHandler';
import { callbackHandler } from '../handlers/callbackHandler';
import { listCalendarsHandler } from '../handlers/calendarHandlers';
import { listEventsHandler } from '../handlers/eventHandlers';
import { listGroupsHandler } from '../handlers/groupHandlers';
import { userinfoHandler } from '../handlers/userinfoHandlers';

/** Mounted under /api; serves /api/google/*. */
export function createGoogleRouter(ctx: GoogleHandlerContext): Router {
  const router = Router();
  const authed = requireSession(ctx);
  router.post('/google/auth/login', loginHandler(ctx));
  router.get('/google/auth/scopes', listScopesHandler(ctx));
  router.post('/google/auth/scopes', authed, scopesHandler(ctx));
  router.get('/google/auth/start', authed, startHandler(ctx));
  router.get('/google/auth/callback', callbackHandler(ctx));
  router.get('/google/calendars', authed, listCalendarsHandler(ctx));
  router.get('/google/events', authed, listEventsHandler(ctx));
  router.get('/google/groups', authed, listGroupsHandler(ctx));
  router.get('/google/userinfo', authed, userinfoHandler(ctx));
  return router;
}
