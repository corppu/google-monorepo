FROM node:24-alpine
WORKDIR /repo
ENV NODE_ENV=production

COPY . .
# NODE_ENV is set after install so devDependencies (vite, tsx) are available for the build and runtime.
RUN NODE_ENV=development npm ci --ignore-scripts \
      -w app-express -w app-client -w lib-express-ssr -w lib-express-rsc \
 && npm run build:client && npm run build:ssr && npm run build:rsc \
 && npm cache clean --force

ENV PORT=3000
EXPOSE 3000
USER node
HEALTHCHECK --interval=15s --timeout=3s --start-period=20s \
  CMD wget -qO- http://127.0.0.1:3000/ssr/google >/dev/null || exit 1
CMD ["npm", "start"]
