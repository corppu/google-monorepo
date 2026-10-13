// lib-express-rsc forces NODE_ENV=production when unset, so decide mock support first.
process.env.ALLOW_MOCK ??= String(process.env.NODE_ENV !== 'production');
require.extensions['.css'] = () => {};
require('tsx/cjs');
require('./server.ts');
