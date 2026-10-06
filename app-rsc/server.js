process.env.NODE_ENV ??= 'production';
const { createRequestListener } = await import('@remix-run/node-fetch-server');
const { default: express } = await import('express');
const { default: build } = await import('./dist/rsc/index.js');

const app = express();
app.use('/rsc', express.static('dist/client', { index: false, maxAge: '1y' }));
app.all('/rsc{/*splat}', createRequestListener(build));
app.get('/', (_req, res) => res.redirect('/rsc'));

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => console.log(`RSC app listening on :${port}/rsc`));
