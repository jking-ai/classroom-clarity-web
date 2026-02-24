import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { ClientRequest, IncomingMessage } from 'http';

const apiKey = defineSecret('<YOUR_API_KEY_SECRET>');

const API_TARGET = process.env.API_TARGET;
if (!API_TARGET) throw new Error('API_TARGET environment variable is required');

const app = express();
app.use(cors({ origin: true }));

app.use(
  '/',
  createProxyMiddleware({
    target: API_TARGET,
    changeOrigin: true,
    timeout: 300_000,
    on: {
      proxyReq: (proxyReq: ClientRequest, req: IncomingMessage) => {
        proxyReq.setHeader('X-API-Key', apiKey.value());

        // Firebase Functions v2 consumes the request body stream before it
        // reaches the proxy middleware. We use rawBody (the untouched Buffer
        // that Firebase provides) to re-write the original bytes — this
        // preserves multipart boundaries, JSON, and any other content type.
        const firebaseReq = req as IncomingMessage & { rawBody?: Buffer; body?: unknown };
        if (firebaseReq.rawBody?.length) {
          proxyReq.setHeader('Content-Length', firebaseReq.rawBody.length);
          proxyReq.write(firebaseReq.rawBody);
        }
      },
    },
  })
);

export const apiProxy = onRequest(
  {
    region: 'us-central1',
    secrets: [apiKey],
    timeoutSeconds: 300,
    memory: '512MiB',
  },
  app
);
