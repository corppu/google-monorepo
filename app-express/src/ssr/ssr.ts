import { ssrRouter } from '@gm/lib-express-client';
import { loadDashboardData, sessionIdOf } from '@gm/lib-express-google';
import type { GoogleHandlerContext } from '@gm/lib-express-google';

/** Thin wrapper around lib-express-client. */
export const createSsr = (ctx: GoogleHandlerContext) =>
  ssrRouter({
    loadDashboard: async (req) => {
      const sid = sessionIdOf(ctx, req);
      return sid ? loadDashboardData(ctx, sid) : undefined;
    }
  });
