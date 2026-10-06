import { createFromReadableStream } from '@vitejs/plugin-rsc/ssr';
import type { ReactFormState } from 'react-dom/client';
import { renderToReadableStream as renderHTMLToReadableStream } from 'react-dom/server.edge';
import {
  unstable_RSCStaticRouter as RSCStaticRouter,
  unstable_routeRSCServerRequest as routeRSCServerRequest,
} from 'react-router';

export async function generateHTML(
  request: Request,
  serverResponse: Response,
): Promise<Response> {
  return await routeRSCServerRequest({
    createFromReadableStream,
    async renderHTML(getPayload) {
      const payload = await getPayload();
      const formState =
        payload.type === 'render'
          ? ((await payload.formState) as ReactFormState | undefined)
          : undefined;
      const bootstrapScriptContent =
        await import.meta.viteRsc.loadBootstrapScriptContent('index');
      return await renderHTMLToReadableStream(
        <RSCStaticRouter getPayload={getPayload} />,
        { bootstrapScriptContent, formState },
      );
    },
    request,
    serverResponse,
  });
}
