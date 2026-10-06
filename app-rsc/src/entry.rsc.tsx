import {
  createTemporaryReferenceSet,
  decodeAction,
  decodeFormState,
  decodeReply,
  loadServerAction,
  renderToReadableStream,
} from '@vitejs/plugin-rsc/rsc';
import { unstable_matchRSCServerRequest as matchRSCServerRequest } from 'react-router';
import { routes } from './routes/config';

function fetchServer(request: Request) {
  return matchRSCServerRequest({
    createTemporaryReferenceSet,
    decodeAction,
    decodeFormState,
    decodeReply,
    generateResponse(match, options) {
      return new Response(renderToReadableStream(match.payload, options), {
        headers: match.headers,
        status: match.statusCode,
      });
    },
    loadServerAction,
    request,
    routes: routes(),
  });
}

export default async function handler(request: Request) {
  const ssr = await import.meta.viteRsc.loadModule<
    typeof import('./entry.ssr')
  >('ssr', 'index');
  return ssr.generateHTML(request, await fetchServer(request));
}

if (import.meta.hot) import.meta.hot.accept();
