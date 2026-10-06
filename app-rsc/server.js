import { createRequestListener } from '@remix-run/node-fetch-server';
import express from 'express';
import build from './dist/rsc/index.js';

const app = express();
app.use(
  '/assets',
  express.static('dist/client/assets', { immutable: true, maxAge: '1y' }),
);
app.use(express.static('dist/client'));
app.use(createRequestListener(build));

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => console.log(`RSC app listening on :${port}`));
