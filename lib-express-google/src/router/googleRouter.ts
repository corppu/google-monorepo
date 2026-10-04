import { Router } from 'express';
import { requireSession } from '../handlers/context';
import type { GoogleHandlerContext } from '../handlers/context';
import { loginHandler } from '../handlers/loginHandler';
import { scopesHandler, listScopesHandler } from '../handlers/scopesHandler';
import { startHandler } from '../handlers/startHandler';
import {
  nativeLoginHandler,
  nativeStartHandler,
  nativeExchangeHandler,
} from '../handlers/nativeHandlers';
import { callbackHandler } from '../handlers/callbackHandler';
import { listCalendarsHandler } from '../handlers/calendarHandlers';
import {
  listEventsHandler,
  updateEventHandler,
} from '../handlers/eventHandlers';
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
  router.post('/google/auth/native/login', nativeLoginHandler(ctx));
  router.post('/google/auth/native/start', authed, nativeStartHandler(ctx));
  router.post(
    '/google/auth/native/exchange',
    authed,
    nativeExchangeHandler(ctx),
  );
  router.get('/google/calendars', authed, listCalendarsHandler(ctx));
  router.get('/google/events', authed, listEventsHandler(ctx));
  router.patch('/google/events/:eventId', authed, updateEventHandler(ctx));
  router.get('/google/groups', authed, listGroupsHandler(ctx));
  router.get('/google/userinfo', authed, userinfoHandler(ctx));
  return router;
}
