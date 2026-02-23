import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import express from 'express';
import cors from 'cors';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import type { ClientRequest, IncomingMessage } from 'http';

const apiKey = defineSecret('<YOUR_API_KEY_SECRET>');

const API_TARGET = process.env.API_TARGET || 'https://<YOUR_CLOUD_RUN_URL>';

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
        // Firebase Functions v2 parses the request body before it reaches
        // the proxy middleware, consuming the readable stream. fixRequestBody
        // re-serialises req.body back onto the proxy request so the backend
        // actually receives the POST data.
        fixRequestBody(proxyReq, req);
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
