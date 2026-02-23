import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
app.use(cors({ origin: true }));

const API_TARGET = process.env.API_TARGET || 'http://localhost:8080';

app.use(
    '/', // Note: since firebase appends the function name or strips the path based on rewrites, we proxy to /api
    createProxyMiddleware({
        target: API_TARGET,
        changeOrigin: true,
    })
);

export const apiProxy = functions.https.onRequest(app);
